import { useState, useEffect, useRef } from "react"
import type { FC ,Dispatch, SetStateAction } from 'react'
import axios from "axios"
import { IoIosCloseCircleOutline } from "react-icons/io";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import styled from "styled-components"



const BASE_URL = import.meta.env.VITE_BASE_URL


const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .iframe-container{
        width: 90%;
        height: 90%;
        background: white;
        position: relative;
        overflow-y: auto;
    }

    .icon{
        position: fixed;
        right: 6%;
        top: 6%;
        z-index: 10;
        color: red;
    }

    .btn{
        position: absolute;
        background-color: green;
        bottom: -3%;
        left: 50%;
        transform: translateX(-50%);
    }
`

type MpModalProps = {
    setModalOpen: (open:boolean) => void
    setQrCode:Dispatch<SetStateAction<string | null>>
    total:number
    token:string
    getAllOrders: () => Promise<void>
}

initMercadoPago(import.meta.env.VITE_PUBLIC_KEY_TP, { locale: 'pt-BR' })

const MpModal:FC<MpModalProps> = ({
    setModalOpen,
    setQrCode,
    total,
    token,
    getAllOrders
})=>{
    const [status, setStatus] = useState<string>('')
    const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false)
    const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    
    
    useEffect(()=>{
        return ()=>{
            if(pollingIntervalRef.current){
                clearInterval(pollingIntervalRef.current)
            }
        }
    }, [])


    const handleSubmit = async(formData:any)=>{
        try{
            const res = await axios.post(`${BASE_URL}/orders/payment`, 
                {                
                    paymentMethodId: formData.payment_method_id,
                    token: formData.token,
                    issuerId: formData.issuer_id,
                    installments: formData.installments,
                    payerEmail: formData.payer?.email,
                    payerIdentification: formData.payer?.identification
                },
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            )

            const paymentId = res.data.orderId
            if(!paymentId){
                throw new Error('Payment response did not include its internal ID')
            }

            const initialStatus = String(res.data.status || '').toLowerCase()
            setStatus(initialStatus)
            setQrCode(null)

            if(initialStatus === 'approved'){
                await getAllOrders()
                return
            }

            if(['rejected', 'cancelled'].includes(initialStatus)) return

            setIsCheckingStatus(true)

            pollingIntervalRef.current = setInterval(async()=>{
                try{
                    const statusResponse = await axios.get(
                        `${BASE_URL}/orders/payment/${paymentId}/status`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )

                    const currentStatus = 
                        String(statusResponse.data.status || '').toLowerCase()

                    setStatus(currentStatus)

                    if(['approved', 'rejected', 'cancelled'].includes(currentStatus)){
                        if(pollingIntervalRef.current){
                            clearInterval(pollingIntervalRef.current)
                            pollingIntervalRef.current = null
                        }

                        setIsCheckingStatus(false)

                        if(currentStatus === 'approved'){
                            await getAllOrders()
                        }
                    }
                }catch(error){
                    console.error('Card payment status check failed:', error)
                }
            }, 5000)
        }catch(e:any){
            const message =
                e?.response?.data?.message ||
                e?.message ||
                'Card payment failed'

            console.error(message)
            setStatus(message)
        }        
    }



    return(
        <Container onClick={() =>{
            if(!isCheckingStatus) setModalOpen(false)
        }}>
            <div onClick={e => e.stopPropagation()} className="iframe-container">
                {window.innerWidth < 768 && !isCheckingStatus && (
                    <IoIosCloseCircleOutline 
                        className="icon"
                        size={25} 
                        onClick={() => setModalOpen(false)}
                    />
                )}
                    <CardPayment
                        onSubmit={handleSubmit}
                        initialization={{
                            amount: total
                        }}
                    />
                {status && <p style={{marginTop:'2rem'}}>Status: {status}</p>}
                {isCheckingStatus && (
                    <p role="status">Awaiting payment confirmation...</p>
                )}
            </div>
        </Container>
    )
}


export default MpModal






