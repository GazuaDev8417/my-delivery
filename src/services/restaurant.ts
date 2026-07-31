import axios from "axios"
import type { Products, Restaurant } from "../types/types"

const BASE_URL = import.meta.env.VITE_BASE_URL


export const restaurantService = {
    getRestaurant: async():Promise<Restaurant>=>{
        const response = await axios.get<Restaurant>(`${BASE_URL}/restaurants`)
        return response.data
    },

    getProducts: async():Promise<Products[]>=>{
        const response = await axios.get<Products[]>(`${BASE_URL}/restaurants/products`)
        return response.data
    },

    createOrder: async(body:object, token:string):Promise<string>=>{
        try{
            const response = await axios.post<string>(`${BASE_URL}/orders`, body, {
                headers: { Authorization: token }
            })
            return response.data
        }catch(e:any){
            const errorMessage = e.response?.data?.message || e.response?.data || e.message
            throw new Error(errorMessage)
        }
    }
}