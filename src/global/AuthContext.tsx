import { createContext, useContext, useState, type Dispatch, type FC, type ReactNode, type SetStateAction } from "react"
import { type CustomerNotifications } from "../services/notifications"


interface AuthContextType{
    token:string | null
    setToken: (token:string | null) => void
    login: (token:string) => void
    logout: () => void
    notifications:CustomerNotifications[]
    setNotifications:Dispatch<SetStateAction<CustomerNotifications[]>>
}



const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider:FC<{ children:ReactNode }> = ({ children })=>{
    const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))
    const [notifications, setNotifications] = useState<CustomerNotifications[]>([])

    
    const login = (newToken:string)=>{
        localStorage.setItem('token', newToken)
        setTokenState(newToken)
    }


    const logout = ()=>{
        localStorage.clear()
        setTokenState(null)
    }

    return(
        <AuthContext.Provider value={{
            token, setToken:setTokenState, login, logout, notifications, setNotifications
        }}>
            { children }
        </AuthContext.Provider>
    )
}


export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(!context) throw new Error('useAuth must be use within AuthProvider')

    return context
}