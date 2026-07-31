import { createContext, useContext, useState, type FC, type ReactNode } from "react"


interface AuthContextType{
    token:string | null
    setToken: (token:string | null) => void
    login: (token:string) => void
    logout: () => void
}



const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider:FC<{ children:ReactNode }> = ({ children })=>{
    const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))

    
    const login = (newToken:string)=>{
        localStorage.setItem('token', newToken)
        setTokenState(newToken)
    }


    const logout = ()=>{
        localStorage.removeItem('token')
        setTokenState(null)
    }

    return(
        <AuthContext.Provider value={{ token, setToken:setTokenState, login, logout}}>
            { children }
        </AuthContext.Provider>
    )
}


export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(!context) throw new Error('useAuth must be use within AuthProvider')

    return context
}