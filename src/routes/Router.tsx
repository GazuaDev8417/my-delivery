import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import type { FC } from 'react'
import { AppRoutes } from './path'
import ProtectedRoutes from './ProtectedRoutes'



const Detail = lazy(() => import('../pages/detail/Detail'))
const Cart = lazy(() => import('../pages/cart/Cart'))
const Signup = lazy(() => import('../pages/signup/Signup'))
const UserAddress = lazy(() => import('../pages/address/UserAddress'))
const Login = lazy(() => import('../pages/login/Login'))
const Profile = lazy(() => import('../pages/progile/Profile'))
const EditoProfile = lazy(() => import('../pages/editProfile/EditProfile'))


const PageLoader = () => <div className="flex h-screen items-center justify-center">Loading...</div>



const Router:FC = ()=>{
    return(
        <Suspense fallback={<PageLoader/>}>
            <Routes>
                <Route path={AppRoutes.HOME} element={<Detail/>}/>
                <Route path={AppRoutes.LOGIN} element={<Login/>}/>
                <Route path={AppRoutes.SIGNUP} element={<Signup/>}/>


                <Route 
                    path={AppRoutes.CART} 
                    element={
                        <ProtectedRoutes>
                            <Cart/>
                        </ProtectedRoutes>
                    }/>

                <Route 
                    path={AppRoutes.PROFILE} 
                    element={
                        <ProtectedRoutes>
                            <Profile/>
                        </ProtectedRoutes>
                    }/>
                
                <Route 
                    path={AppRoutes.EDIT_PROFILE} 
                    element={
                        <ProtectedRoutes>
                            <EditoProfile/>
                        </ProtectedRoutes>
                    }/>
                
                <Route 
                    path={AppRoutes.ADDRESS} 
                    element={
                        <ProtectedRoutes>
                            <UserAddress/>
                        </ProtectedRoutes>
                    }/>
                
                <Route path='*' element={<Navigate to={AppRoutes.HOME} replace />} />
            </Routes>
        </Suspense>
    )
}


export default Router