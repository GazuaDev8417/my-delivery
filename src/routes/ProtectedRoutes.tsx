import type { FC, ReactElement} from "react"
import { Navigate, useLocation } from 'react-router-dom'
import { AppRoutes } from "./path"
import { useAuth } from "../global/AuthContext"


interface ProtectedRoutesProps{
    children:ReactElement
}


const ProtectedRoutes:FC<ProtectedRoutesProps> = ({ children })=>{
    const { token } = useAuth()
    const location = useLocation()

    if(!token){
        return <Navigate to={AppRoutes.LOGIN} state={{from: location}} replace />
    }

    return children
}


export default ProtectedRoutes