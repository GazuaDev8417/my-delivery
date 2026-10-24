import { type ChangeEvent, type FC, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useGlobal } from "../../global/Context"
import { IoPersonOutline } from "react-icons/io5"
import { IoIosArrowBack } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import Header from "../../components/Header"
import MpModal from "../../components/MpModal" // Restored target modal
import { Container } from "./styled"
import { restaurantService } from "../../services/restaurant"
import type { Order, Restaurant } from "../../types/types"
import { initMercadoPago } from "@mercadopago/sdk-react"

const BASE_URL = import.meta.env.VITE_BASE_URL
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
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [selectedProviderId, setSelectedProviderId] = useState<string>('')

    const hasQrCode = !!(qrCode || qrCodeBase64 || qrCodeLink)
    const pollingIntervalRef = useRef<ReturnType<typeof setInterval>>(null)



    const providerIdsKey = [...new Set(cart.map(item => item.provider))].join(',')

    useEffect(()=>{
        const providerIds = providerIdsKey ? providerIdsKey.split(',') : []
        let cancelled = false

        if(providerIds.length === 0){
            setRestaurants([])
            setSelectedProviderId('')
            return
        }

        Promise.all(
            providerIds.map(id => restaurantService.restaurantByCustomer(id))
        )
            .then(data =>{
                if(cancelled) return

                setRestaurants(data)
                setSelectedProviderId(current =>
                    providerIds.includes(current) ? current : providerIds[0]
                )
            })
            .catch(error =>{
                if(!cancelled) console.error('Falha ao buscar estabelecimentos: ', error)
            })

        return () =>{
            cancelled = true
        }
    }, [providerIdsKey])


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



    const selectedOrders = cart.filter(
        item => item.provider === selectedProviderId
    )  

    const selectedRestaurant = restaurants.find(
        restaurant => restaurant.id === selectedProviderId
    )

    const selectedTotal = calculateTotal(selectedOrders)


    const handleQuantityChange = async(e:ChangeEvent<HTMLInputElement>, id:string)=>{
        const newQuantity = Math.max(1, Number(e.target.value))
        const updatedCart = cart.map(item => item.id === id ? { ...item, quantity: newQuantity }: item)

        setCart(updatedCart)

        try{
            await axios.patch(`${BASE_URL}/orders/${id}/quantity`, { quantity: newQuantity })
            handlePixPayment()
        }catch(e:any){
            console.error(e?.response?.data?.message || e?.response?.data || e?.message)
        }
    }


    const removeItem = async(id:string)=>{
        try{
            await axios.delete(`${BASE_URL}/orders/${id}`)
            setCart(prev => prev.filter(order => order.id !== id))
            getAllOrders()
            handlePixPayment()
        }catch(e:any){
            console.error(e?.response?.data?.message || e?.response?.data || e?.message)
        }
    }


    const clearCartOnSuccess = async()=>{
        const config = { headers: { Authorization: token }}
        try{
            await axios.patch(`${BASE_URL}/finish_orders`, {}, config)
            getAllOrders()
            setCart([])
        }catch(e:any){
            console.error(e?.response?.data?.message || e?.response?.data || e?.message)
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
            console.error(e?.response?.data?.message || e?.response?.data || e?.message)
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
        if(!selectedRestaurant || selectedOrders.length === 0) return

        const orderDetails = selectedOrders.map(item=>
            `${item.quantity} x ${item.product} - $${Number(item.price).toFixed(2)}`
        ).join('\n')

        const message =
            `Pedido para ${selectedRestaurant.name}:\n\n${orderDetails}\n\n` +
            `Total: R$ ${selectedTotal.toFixed(2)}\n\n` +
            `Endereço: ${address}, ${number}\nCEP: ${cep}\nBairro: ${local}\n` +
            `Referência: ${reference.trim()}\nContato: ${talkTo}`

        window.open(
            `https://wa.me/${selectedRestaurant.phone}?text=${encodeURIComponent(message)}`,
            "_blank"
        )
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
                        <b>Delivery address</b>: {address ? `${address}, ${number}` : 'No address set'}<br />
                        <b>Postal Code</b>: {cep}<br />
                        <b>Neighborhood</b>: {local}<br />
                        <b>Reference point</b>: {reference || 'N/A'}<br />
                        <b>Talk to</b>: {talkTo}
                    </div>
                    <MdEdit className="icon" onClick={() => navigate('/user-address', { state: { mode: 'cart' } })} />
                </div>

                <div className="addressAndName">
                    <div className="rest-name">Your Products</div>
                    <div style={{marginTop:10, textAlign:'center'}}>Grand Total: R$ {Number(total).toFixed(2)}</div>
                </div>
                <hr style={{ width: '100%', marginBottom: '15px', backgroundColor: 'lightgray', border: 'none', height: '1px' }} />

                <div className="restaurants-container">
                    {restaurants.map(restaurant => (
                        <button
                            className="restaurant-button"
                            key={restaurant.id}
                            onClick={() => setSelectedProviderId(restaurant.id)}
                        >
                            {restaurant.name}
                        </button>
                    ))}
                </div>

                <div className="cart-container" ref={cartRef}>
                    {selectedOrders.length > 0 ? selectedOrders.map(item => (
                        <div className="card" key={item.id}>
                            <span>
                                <img src={`imgs/products/${item.photoUrl}`} alt={item.product} />
                            </span>
                            <span>
                                <div className="product-name">{item.product}</div>
                                <div className="product-details">
                                    <b>Quantity: </b>{item.quantity} <br />
                                    <b>Price: </b>R$ {Number(item.price).toFixed(2)} <br />
                                    <b>Total: </b>R$ {(Number(item.price) * Number(item.quantity)).toFixed(2)} <br />
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
                        <h3>Escaneie o QR Code para concluir o pagamento:</h3>
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
                        <div className="totalByGroup"><b>Establishment total</b>: R$ {selectedTotal.toFixed(2)}</div>
                        
                        <div className="payment-action-hub" style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                            <button 
                                className="address-button" 
                                onClick={handlePixPayment} 
                                disabled={isProcessing}
                                style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#00bfa5', color: 'white', border: 'none', borderRadius: '6px' }}
                            >
                                {isProcessing ? 'Loading...' : 'Pay with Pix'}
                            </button>

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
                                Notify via WhatsApp
                            </button>  

                            <button 
                                className="address-button" 
                                onClick={handlePaymentCard}
                                style={{ flex: 1, padding: '10px', cursor: 'pointer', backgroundColor: '#2979ff', color: 'white', border: 'none', borderRadius: '6px' }}
                            >
                                Credit Card
                            </button>
                        </div>
                    </div>
                )}
            </Container>
        </>
    )


}


export default Cart
