import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useGlobal } from "../../global/Context"
import { MdEdit } from "react-icons/md"
import { AiOutlineLogout } from "react-icons/ai"
import { IoIosArrowBack } from "react-icons/io"
import { FaListAlt } from "react-icons/fa";
import Header from "../../components/Header"
import { Container } from "./styled"
import { formatPhoneNumber } from "../../utils/inputsAndKeys"




const Profile = ()=>{
    const navigate = useNavigate()
    const { user, getProfile } = useGlobal()
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
            localStorage.clear()
            navigate('/', { replace: true })
        }
    }


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
                        onClick={() => navigate('/user-address', { state: { mode: 'update' } })}
                    />
                </div>    
            </Container>
        </>
    )    
}


export default Profile