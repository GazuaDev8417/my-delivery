import type { ChangeEvent, FC, SubmitEvent } from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useGlobal } from "../../global/Context"
import { handleKeyPress, formatPhoneNumber } from "../../utils/inputsAndKeys"
import { BASE_URL } from "../../constants/url"
import { Container } from "./styled"




interface FormData {
    username: string
    email: string
    phone: string
}



const EditProfile:FC = ()=>{
    const navigate = useNavigate()
    const { user, getProfile } = useGlobal()
    const token = localStorage.getItem('token')
    const [form, setForm] = useState<FormData>({
        username: '',
        email: '',
        phone: ''
    })


    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
        } else {
            getProfile()
        }
    }, [token, navigate, getProfile])

    useEffect(() => {
        if (user && user.username) {
            setForm({
                username: user.username,
                email: user.email,
                phone: user.phone || ''
            })
        }
    }, [user])


    const onChange = (e:ChangeEvent<HTMLInputElement>):void=>{
        const { name, value } = e.target
        const updatedValue = name === 'phone' ? value.replace(/\D/g, '') : value

        setForm(prevForm => ({ ...prevForm, [name]: updatedValue }))
    }


    const updateUser = async (e:SubmitEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault()

        const body = {
            username: form.username,
            email: form.email,
            phone: form.phone.replace(/\D/g, '')
        }

        const config = {
            headers: { Authorization: token }
        }
        
        try {
            await axios.patch(`${BASE_URL}/user`, body, config)
            alert("Profile updated successfully!")
            navigate('/profile')
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data || "An unexpected error occurred."
            alert(`Failed to update profile: ${errorMessage}`)
        }
    }


    const clearForm = (): void => {
        setForm({
            username: '',
            email: '',
            phone: ''
        })
    }



    return(
        <Container>
            <div className="title">Update Profile</div>
            <form onSubmit={updateUser}>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                    id="name"
                    type="text"
                    className="form-input"
                    name="username"
                    value={form.username}
                    onChange={onChange}
                    placeholder="First and last name" 
                    autoComplete="name"
                    aria-label="User Full Name"
                    required
                />

                <label htmlFor="tel" className="sr-only">Phone Number</label>
                <input
                    id="tel"
                    type="text"
                    className="form-input"
                    name="phone"
                    onKeyDown={handleKeyPress} /* Swapped obsolete onKeyPress for modern standard onKeyDown */
                    maxLength={11}
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Phone number" 
                    autoComplete="tel"
                    aria-label="Phone Number"
                    required
                />

                <label htmlFor="email" className="sr-only">E-mail</label>
                <input
                    id="email"
                    type="email"
                    className="form-input"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="name@email.com" 
                    autoComplete="email"
                    aria-label="Email address"
                    required
                />

                <div className="btn-container">
                    <div className="submit-btn">
                        <button className="signup-button" type="button" onClick={clearForm}>Clear</button>
                        <button className="signup-button" type="submit">Update</button>
                    </div>
                    <button 
                        className="signup-button signup-button-exception"
                        type="button"
                        onClick={() => navigate('/profile')}
                    >
                        Back to Profile
                    </button>
                </div>
            </form>
        </Container>
    )
}


export default EditProfile