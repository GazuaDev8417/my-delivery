import { createContext, useState, useContext, useCallback } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { User, Order } from '../types/types'
import axios from 'axios'
import { BASE_URL } from '../constants/url'



export interface GlobalStateContextType {
    getProfile: () => Promise<void>
    user: User
    setUser: Dispatch<SetStateAction<User>>
    getAllOrders: () => Promise<void>
    cart: Order[]
    setCart: Dispatch<SetStateAction<Order[]>>
    allFieldsFilled: boolean
    setAllFieldsFilled: Dispatch<SetStateAction<boolean>>
}

type GlobalStateProps = {
    children: ReactNode
}

const Context = createContext<GlobalStateContextType | undefined>(undefined)


const getAuthHeaders = ()=>{
    const token = localStorage.getItem('token')
    if(!token) return null

    return{
        headers: { Authorization: token }
    }
}



export const GlobalState = ({ children }:GlobalStateProps)=>{
    const [cart, setCart] = useState<Order[]>([])
    const [allFieldsFilled, setAllFieldsFilled] = useState<boolean>(false)
    const [user, setUser] = useState<User>({
        id: '',
        username: '',
        email: '',
        street: '',
        number: '',
        neighbourhood: '',
        city: '',
        state: '',
        complement: '',
        phone: '',
        cep: '',
        role: ''
    })




    const getAllOrders = useCallback(async()=>{
        const config = getAuthHeaders()
        if(!config){
            console.warn('getAllOrders: No active token found in localStorage')
            return
        }

        try{
            const response = await axios.get(`${BASE_URL}/active_orders`, config)
            setCart(response.data)
        }catch(e:any){
            console.error('Failed to fetch active orders', e.response?.data || e.message)
        }
    }, [])


    const getProfile = useCallback(async()=>{
        const config = getAuthHeaders()
        if (!config) {
            console.warn("getProfile: No active token found in localStorage.")
            return
        }

        try {
            const response = await axios.get(`${BASE_URL}/profile`, config)
            setUser(response.data)
        } catch (e: any) {
            console.error("Failed to fetch profile:", e.response?.data || e.message)
        }
    }, [])



    return(
        <Context.Provider value={{
            getProfile,
            getAllOrders,
            cart,
            setCart,
            user,
            setUser,
            allFieldsFilled,
            setAllFieldsFilled
        }}>
            {children}
        </Context.Provider>
    )
}


export const useGlobal = ()=>{
    const context = useContext(Context)
    if(!context){
        throw new Error('useGlobal must be used within a GlobalState provider')
    }
    return context
}


export default Context