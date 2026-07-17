import axios from "axios"
import { BASE_URL } from "../constants/url"
import type { Products, Restaurant } from "../types/types"



export const restaurantService = {
    getRestaurant: async():Promise<Restaurant>=>{
        const response = await axios.get<Restaurant>(`${BASE_URL}/restaurant`)
        return response.data
    },

    getProducts: async():Promise<Products[]>=>{
        const response = await axios.get<Products[]>(`${BASE_URL}/restaurant_products`)
        return response.data
    },

    createOrder: async(body:object, token:string):Promise<string>=>{
        const response = await axios.post<string>(`${BASE_URL}/order`, body, {
            headers: { Authorization: token }
        })
        return response.data
    }
}