import axios from "axios"


const BASE_URL = import.meta.env.VITE_BASE_URL



export const authService = {
    login: async(body:object):Promise<string>=>{
        const response = await axios.post<string>(`${BASE_URL}/users/login`, body)
        return response.data
    },

    signup: async(body:object):Promise<string>=>{
        const response = await axios.post<string>(`${BASE_URL}/users/signup`, body)
        return response.data
    }
}
