import type { FC, ReactElement} from "react"
import { Navigate, useLocation } from 'react-router-dom'
import { AppRoutes } from "./path"



interface ProtectedRoutesProps{
    children:ReactElement
}


const ProtectedRoutes:FC<ProtectedRoutesProps> = ({ children })=>{
    const isAuthenticated = !!localStorage.getItem('token')
    const location = useLocation()

    if(!isAuthenticated){
        return <Navigate to={AppRoutes.LOGIN} state={{from: location}} replace />
    }

    return children
}


export default ProtectedRoutes