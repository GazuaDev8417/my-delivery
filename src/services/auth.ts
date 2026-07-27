import axios from "axios"
import { BASE_URL } from "../constants/url"





export const authService = {
    login: async(body:object):Promise<string>=>{
        const response = await axios.post<string>(`${BASE_URL}/users/login`, body)
        return response.data
    }
}
