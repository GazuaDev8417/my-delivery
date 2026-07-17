import axios from "axios"
import { BASE_URL } from "../constants/url"



interface LoginResponse{
    token:string
    role:string
}


export const authService = {
    login: async(body:object):Promise<LoginResponse>=>{
        const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, body)
        return response.data
    }
}
