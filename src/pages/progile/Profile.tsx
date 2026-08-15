import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useGlobal } from "../../global/Context"
import { useAuth } from "../../global/AuthContext"
import { MdEdit } from "react-icons/md"
import { AiOutlineLogout } from "react-icons/ai"
import { FaListAlt } from "react-icons/fa"
import { AppRoutes } from "../../routes/path"
import Header from "../../components/Header"
import { Container } from "./styled"
//import { authService } from "../../services/auth"
import { formatPhoneNumber } from "../../utils/inputsAndKeys"




const Profile = ()=>{
    const navigate = useNavigate()
    const { user, getProfile } = useGlobal()
    const { logout } = useAuth()
    const token = localStorage.getItem('token')


    useEffect(()=>{
        if(!token){
            navigate('/', { replace: true })
        }else{
            getProfile()
        }
    }, [token, navigate, getProfile])


    const handleLogout = ()=>{
        const confirmLogout = window.confirm('Are you sure you want to logout?')
        if(confirmLogout){
            logout()
            navigate('/', { replace: true })
        }
    }


    // const handleDeleteAccount = async()=>{
    //     const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    //     if(!confirmDelete) return

    //     try{
    //         await authService.deleteAccount()
    //         localStorage.clear()
    //         navigate('/', { replace: true })
    //     }catch(e:any){
    //         alert(e?.response?.data?.message || e?.response?.data || 'An error occurred while trying to delete your account.')
    //     }
    // }       
        



    return(
        <>
            <Header
                leftIcon={ <FaListAlt className="header-icon" onClick={() => navigate('/')} /> }
                rightIcon={ <AiOutlineLogout className="header-icon" onClick={handleLogout} /> }
            />
            <Container>
                <h1>User Profile</h1>
                <hr style={{ width: '100%', marginBottom: '15px', backgroundColor: 'lightgray', border: 'none', height: '1px' }} />

                <div className="user-section">
                    <div>
                        <span className="properties">Name:</span> {user.username} <br />
                        <span className="properties">Email:</span> {user.email} <br />
                        <span className="properties">Phone:</span> {formatPhoneNumber(user.phone)}
                    </div>
                    <MdEdit className="icon" onClick={() => navigate('/edit-profile')} />
                </div>
                <div className="address-section">
                    <div style={{ width: '100%' }}>
                        <div className="registered-address">Registered address:</div>
                        <div style={{ maxWidth: '90%' }}>
                            <span className="properties">Local:</span> {user.street}, {user.number || 'S/N'} <br />
                            <span className="properties">Neighborhood:</span> {user.neighbourhood} <br />
                            <span className="properties">City/State:</span> {user.city} - {user.state} <br />
                            <span className="properties">Zip code:</span> {user.cep}
                        </div>
                    </div>
                    <MdEdit 
                        className="icon" 
                        onClick={() => navigate(AppRoutes.PROFILE, { state: { mode: 'update' } })}
                    />
                </div>

                {/*<div className="danger-zone">
                    <button
                        type="button"
                        className="btn-delete-subtle"
                        onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                </div>*/}    
            </Container>
        </>
    )    
}


export default Profile