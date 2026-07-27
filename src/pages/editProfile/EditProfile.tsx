import type { ChangeEvent, FC, SubmitEvent } from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useGlobal } from "../../global/Context"
import { handleKeyPress } from "../../utils/inputsAndKeys"
import { BASE_URL } from "../../constants/url"
import { Container } from "./styled"




interface FormData {
    username: string
    phone: string
}



const EditProfile:FC = ()=>{
    const navigate = useNavigate()
    const { user, getProfile } = useGlobal()
    const token = localStorage.getItem('token')
    const [form, setForm] = useState<FormData>({
        username: '',
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
            phone: form.phone.replace(/\D/g, '')
        }

        const config = {
            headers: { Authorization: token }
        }
        
        try {
            await axios.put(`${BASE_URL}/users/profile`, body, config)
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
            phone: ''
        })
    }



    return(
        <Container>
            <div className="title">Update Profile</div>
            <small className="obs-container">
                You won't can change the email <br /> because it's a credential to access the application.
            </small>
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