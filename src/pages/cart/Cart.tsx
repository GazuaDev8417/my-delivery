import { type ChangeEvent, type FC, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useGlobal } from "../../global/Context"
import { BASE_URL } from "../../constants/url"
import { IoPersonOutline } from "react-icons/io5"
import { IoIosArrowBack } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import Header from "../../components/Header"
import MpModal from "../../components/MpModal" // Restored target modal
import { Container } from "./styled"
import type { Order } from "../../types/types"
import { initMercadoPago } from "@mercadopago/sdk-react"


const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY_TP
if (PUBLIC_KEY) {
    initMercadoPago(PUBLIC_KEY)
}



const Cart:FC = ()=>{
    const navigate = useNavigate()
    const qrCodeRef = useRef<HTMLDivElement>(null)
    const cartRef = useRef<HTMLDivElement>(null)
    const { cart, setCart, getAllOrders, getProfile, user } = useGlobal()
    const token = localStorage.getItem('token')
    // Customer Address Safe Strings Data Extraction
    const address = user?.street || ''
    const number = user?.number || 'S/N'
    const cep = user?.cep || ''
    const local = user?.neighbourhood ? `${user.neighbourhood} - ${user.city}/${user.state}` : ''
    const reference = user?.complement || ''
    const talkTo = user?.username ? user.username.split(' ')[0] : ''

    
    const calculateTotal = (items: Order[]) =>
        items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
    const [total, setTotal] = useState<number>(calculateTotal(cart))
    const [mpModalOpen, setMpModalOpen] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    // Payment Response Parameters State Hooks
    const [status, setStatus] = useState<string>('')
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null)
    const [qrCodeLink, setQrCodeLink] = useState<string | null>(null)
    const [method, setMethod] = useState<'pix' | 'boleto' | 'card' | null>(null)
    
    const hasQrCode = !!(qrCode || qrCodeBase64 || qrCodeLink)
    const pollingIntervalRef = useRef<ReturnType<typeof setInterval>>(null)



    // Authenticated Guard Verification Lifecycle
    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
            return
        }
        getProfile()
        getAllOrders()
    }, [token, navigate, getProfile, getAllOrders])

    // Keep shopping bag values up to date
    useEffect(() => {
        setTotal(calculateTotal(cart))
    }, [cart])


    useEffect(() => {
        if (cart.length === 0) {
            setQrCode(null)
            setQrCodeBase64(null)
            setQrCodeLink(null)
            setMethod(null)
            setStatus('')
        }
    }, [cart.length])

    // UI Escape Key Listener for Modals
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                setMpModalOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Secure Auto-Polling Garbage Collection Cleanup
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
        }
    }, [])


    useEffect(() => {
        if (hasQrCode && qrCodeRef.current) {
            qrCodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        } else if (cart.length > 0 && cartRef.current) {
            cartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [hasQrCode, cart.length])
    
    


    const handleQuantityChange = async(e:ChangeEvent<HTMLInputElement>, id:string)=>{
        const newQuantity = Math.max(1, Number(e.target.value))
        const updatedCart = cart.map(item => item.id === id ? { ...item, quantity: newQuantity }: item)

        setCart(updatedCart)

        try{
            await axios.patch(`${BASE_URL}/orders/${id}/quantity`, { quantity: newQuantity })
            handlePixPayment()
        }catch(e:any){
            console.error(e.response?.data || "Failed to sync element adjustments")
        }
    }


    const removeItem = async(id:string)=>{
        const config = { headers: { Authorization: token }}
        try{
            await axios.delete(`${BASE_URL}/orders/${id}`, config)
            setCart(prev => prev.filter(order => order.id !== id))
            getAllOrders()
            handlePixPayment()
        }catch(e:any){
            alert(e.message || "Failed to remove items from cart.")
        }
    }


    const clearCartOnSuccess = async()=>{
        const config = { headers: { Authorization: token }}
        try{
            await axios.patch(`${BASE_URL}/finish_orders`, {}, config)
            getAllOrders()
            setCart([])
        }catch(e){
            console.error("Failed to clear local order list logs:", e)
        }
    }


    const handlePixPayment = async()=>{
        if(isProcessing) return
        setIsProcessing(true)
        setMethod('pix')

        try{
            const response = await axios.post(`${BASE_URL}/orders/payment`, {
                paymentMethodId: 'pix',
                email: user.email,
                items: cart.map(item=>({
                    title: item.product,
                    quantity: item.quantity,
                    unit_price: Number(item.price)
                }))
            })

            setStatus(response.data.status || 'pending')
            setQrCode(response.data.qrCode || null)
            setQrCodeBase64(response.data.qrCodeBase64 || null)
            setQrCodeLink(response.data.qrCodeLink || null)

            const orderId = response.data.id
            if(!orderId) throw new Error('Payment gateway order identity failed.')

            // Safe stateful background interval polling instance
            pollingIntervalRef.current = setInterval(async()=>{
                try{
                    const statusRes = await fetch(`${BASE_URL}/orders/payment/${orderId}/status`)
                    const statusData = await statusRes.json()

                    if(statusData.status === 'approved'){
                        if(pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
                        setStatus('approved')
                        alert('Pix payment approved successfully!')
                        await clearCartOnSuccess()
                    }
                }catch(pollErr){
                    console.error("Status check tracking intermittent variance: ", pollErr)
                }
            }, 5000)
        }catch(e:any){
            console.error('Processing transaction breakdown payload logic exception: ', e)
            alert(e.response?.data || 'Failed to initialize payment workflow.')
        }finally{
            setIsProcessing(false)
        }
    }


    const handlePaymentCard = () => {
        setQrCode(null)
        setQrCodeBase64(null)
        setQrCodeLink(null)
        setMethod('card')
        setMpModalOpen(true)
    }


    const notifyViaWhatsApp = ()=>{
        if(cart.length === 0) return

        const orderDetails = cart.map(item=>
            `${item.quantity} x ${item.product} - $${Number(item.price).toFixed(2)} each\nSubtotal: $${(Number(item.price) * item.quantity).toFixed(2)}\n`
        ).join('\n')

        const totalMessage = `Grand Total: $${Number(total).toFixed(2)}`
        const fullSummary = `New Order Request:\n\n${orderDetails}\n${totalMessage}\n\nDelivery Address Details:\nStreet: ${address}, ${number}\nPostal Code: ${cep}\nRegion: ${local}\nRef: ${reference.trim()}\nContact Name: ${talkTo}`
        
        const whatsAppUrl = `https://wa.me/5571983923747?text=${encodeURIComponent(fullSummary)}`
        window.open(whatsAppUrl, '_blank')
    }



    return(
        <>
            <Header
                leftIcon={<IoIosArrowBack className='header-icon' onClick={() => navigate(-1)} />}
                rightIcon={<IoPersonOutline className="header-icon" onClick={() => navigate('/profile')} />}
            />

            <Container>
                <h1>My Shopping Cart</h1>
                <hr style={{ width: '100%', marginBottom: '15px', backgroundColor: 'lightgray', border: 'none', height: '1px' }} />
                
                <div className="address-section">
                    <div>
                        <b>Delivery Address</b>: {address ? `${address}, ${number}` : 'No address set'}<br />
                        <b>Postal Code (CEP)</b>: {cep}<br />
                        <b>Region</b>: {local}<br />
                        <b>Reference Point</b>: {reference || 'N/A'}<br />
                        <b>Contact recipient</b>: {talkTo}
                    </div>
                    <MdEdit className="icon" onClick={() => navigate('/user-address', { state: { mode: 'cart' } })} />
                </div>

                <div className="addressAndName">
                    <div className="rest-name">Your Selected Products</div>
                </div>
                <hr style={{ width: '100%', marginBottom: '15px', backgroundColor: 'lightgray', border: 'none', height: '1px' }} />

                <div className="cart-container" ref={cartRef}>
                    {cart.length > 0 ? cart.map(item => (
                        <div className="card" key={item.id}>
                            <span>
                                <img src={item.photoUrl} alt={item.product} />
                            </span>
                            <span>
                                <div className="product-name">{item.product}</div>
                                <div className="product-details">
                                    <b>Quantity: </b>{item.quantity} <br />
                                    <b>Unit Price: </b>$ {Number(item.price).toFixed(2)} <br />
                                    <b>Total: </b>$ {(Number(item.price) * Number(item.quantity)).toFixed(2)} <br />
                                </div>
                            </span>
                            <div className="btn-container">
                                <input 
                                    type="number"
                                    min={1} 
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(e, item.id)}
                                    className="input-number" 
                                />                 
                                <button className="btn-remove" onClick={() => removeItem(item.id)}>Remove</button> 
                            </div>
                        </div>
                    )) : <div style={{ margin: 20, textAlign: 'center', color: '#666' }}>Your cart is empty.</div>}
                </div>

                {/* Mercado Pago Integration Components Layer */}
                {mpModalOpen && method === 'card' && (
                    <MpModal setModalOpen={setMpModalOpen} setQrCode={setQrCode} total={total} />
                )}

                {/* Render Pix Instant QR Output Layout Block */}
                {method === 'pix' && hasQrCode && (
                    <div ref={qrCodeRef} className="payment-gateway-pix-box" style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <h3>Scan QR Code to complete payment:</h3>
                        {qrCodeBase64 ? (
                            <img width='220' src={`data:image/png;base64,${qrCodeBase64}`} alt="Instant Pix QR Code" style={{ margin: '15px auto' }} />
                        ) : qrCode ? (
                            <img width='220' src={`https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(qrCode)}`} alt="Instant Pix QR Code" style={{ margin: '15px auto' }} />
                        ) : null}

                        {qrCodeLink && (
                            <p style={{ margin: '12px 0' }}>
                                <a href={qrCodeLink} target="_blank" rel="noopener noreferrer" className="gateway-link-btn" style={{ color: '#b11717', fontWeight: 600 }}>
                                    Copy Pix Code Link / Open Gateway App
                                </a>
                            </p>
                        )}

                        {status && (
                            <div className={`status-pill ${status}`} style={{ fontWeight: 600, color: status === 'approved' ? 'green' : '#ff9800' }}>
                                Status: {status === 'pending' ? 'Pending Payment verification...' : 'Completed'}
                            </div>
                        )}
                    </div>
                )}

                {cart.length > 0 && (
                    <div className="total-container">
                        <div className="totalByGroup"><b>Total Summary</b>: $ {Number(total).toFixed(2)}</div>
                        
                        <div className="payment-action-hub" style={{ display: 'flex', gap: '1rem', margin: '15px 0', width: '100%', maxWidth: '340px' }}>
                            <button 
                                className="address-button checkout-pay-btn" 
                                onClick={handlePixPayment} 
                                disabled={isProcessing}
                                style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#00bfa5', color: 'white', border: 'none', borderRadius: '6px' }}
                            >
                                {isProcessing ? 'Loading...' : 'Pay with Pix'}
                            </button>

                            <button 
                                className="address-button checkout-pay-btn" 
                                onClick={handlePaymentCard}
                                style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#2979ff', color: 'white', border: 'none', borderRadius: '6px' }}
                            >
                                Credit Card
                            </button>
                        </div>

                        <button 
                            className="requestOrder-btn"
                            style={{
                                width: '100%',
                                maxWidth: '340px',
                                padding: '12px',
                                fontWeight: 600,
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'white',
                                backgroundColor: '#25D366' // Standard WhatsApp brand color theme
                            }}
                            onClick={notifyViaWhatsApp}
                        >
                            Notify Seller via WhatsApp
                        </button>                                                     
                    </div>
                )}
            </Container>
        </>
    )


}


export default Cart