import axios from 'axios'


const BASE_URL = import.meta.env.VITE_BASE_URL

export interface CustomerNotifications{
    id:string
    notification:string
    is_read:boolean
    created_at:string
}


const token = localStorage.getItem('token')

export const notifificationService = {
    getNofifications: async():Promise<CustomerNotifications[]>=>{
        const response = await axios.get<CustomerNotifications[]>(`${BASE_URL}/customers-notifications`, {
            headers: { Authorization: token }
        })
        return response.data
    },

    updateNotification: async(id:string):Promise<void>=>{
        const response = await axios.put(`${BASE_URL}/customers-notifications/update/${id}`, {}, {
            headers: { Authorization: token }
        })
        return response.data
    },

    updateAllNotifications: async():Promise<void>=>{
        const response = await axios.put(`${BASE_URL}/customers-notifications/update/all`, {}, {
            headers: { Authorization: token }
        })
        return response.data
    }
}