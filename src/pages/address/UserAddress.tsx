import { useEffect, useState } from "react"
import type { ChangeEvent, FC, SubmitEvent } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { useGlobal } from "../../global/Context"
import { BASE_URL } from "../../constants/url"
import { Container } from "./styled"
import { IoIosArrowBack } from 'react-icons/io'
import { handleKeyPress } from "../../utils/inputsAndKeys"




interface FormData {
    street: string
    cep: string
    number: string
    neighbourhood: string
    city: string
    state: string
    complement: string
}



const UserAddress:FC = ()=>{
    const navigate = useNavigate()
    const location = useLocation()
    const { user, getProfile } = useGlobal()
    const mode = location.state?.mode || 'create'
    const token = localStorage.getItem('token')
    const [form, setForm] = useState<FormData>({
        street: '',
        cep: '',
        number: '',
        neighbourhood: '',
        city: '',
        state: '',
        complement: ''
    })


    useEffect(()=>{
        if(!token){
            navigate('/', { replace: true })
        }else if(mode === 'update'){
            setForm({
                street: user.street || '',
                cep: user.cep || '',
                number: user.number || '',
                neighbourhood: user.neighbourhood || '',
                city: user.city || '',
                state: user.state || '',
                complement: user.complement || ''
            })
        }
    }, [token, mode, user, navigate])



    const findAddressByCep = async()=>{
        const cleanCep = form.cep.replace(/\D/g, '')

        if(cleanCep.length !== 8) return

        try{
            const res = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`)
            
            if (res.data.erro) {
                alert("Postal code not found. Please verify the entered CEP.")
                return
            }

            setForm(prev => ({
                ...prev,
                street: res.data.logradouro || '',
                neighbourhood: res.data.bairro || '',
                city: res.data.localidade || '',
                state: res.data.uf || ''
            }))
        }catch(e){
            console.error("Failed to auto-fetch address via CEP:", e)
        }
    }


    const onChange = (e: ChangeEvent<HTMLInputElement>):void=>{
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }


    const saveAddress = async(e:SubmitEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault()

        const config = {
            headers: { Authorization: token }
        }
        
        try {
            await axios.patch(`${BASE_URL}/user-address`, form, config)
            await getProfile()
            
            alert(mode === 'create' ? "Address registered successfully!" : "Address updated successfully!")
            
            if (mode === 'create') navigate('/', { replace: true })
            else if (mode === 'update') navigate('/profile')
            else navigate('/cart')
            
        } catch (error: any) {
            const errMsg = error.response?.data?.message || error.response?.data || "An error occurred updating the address details."
            alert(`Submission failed: ${errMsg}`)
        }
    }



    const clearForm = ()=>{
        setForm({
            street: '',
            cep: '',
            number: '',
            neighbourhood: '',
            city: '',
            state: '',
            complement: ''
        })
    }



    return(
        <Container>
            <IoIosArrowBack
                onClick={() => navigate(-1)} 
                className="back-icon-btn"
                aria-label="Go Back"
            />
            <div className="title">
                {mode === 'create' ? 'Add Address' : 'Update Address'}
            </div>
            
            <form onSubmit={saveAddress}>
                <label htmlFor="cep" className="sr-only">Postal Code (CEP)</label>
                <input
                    id="cep"
                    type="text"
                    className="form-input"
                    name="cep"
                    onKeyDown={handleKeyPress}
                    value={form.cep}
                    maxLength={9}
                    onChange={onChange}
                    onBlur={findAddressByCep}
                    placeholder="Postal Code (CEP)" 
                    autoComplete="postal-code"
                    required
                />

                <label htmlFor="address" className="sr-only">Street Address</label>
                <input
                    id="address"
                    type="text"
                    className="form-input"
                    name="street"
                    value={form.street}
                    onChange={onChange}
                    placeholder="Street / Avenue / Address line" 
                    autoComplete="street-address"
                    required
                />

                <label htmlFor="number" className="sr-only">Number</label>
                <input
                    id="number"
                    type="text"
                    className="form-input"
                    name="number"
                    value={form.number}
                    onChange={onChange}
                    placeholder="Number / Suite"
                    autoComplete="disabled"
                />

                <label htmlFor="neighbourhood" className="sr-only">Neighborhood</label>
                <input
                    id="neighbourhood"
                    type="text"
                    className="form-input"
                    name="neighbourhood"
                    value={form.neighbourhood}
                    onChange={onChange}
                    placeholder="Neighborhood" 
                    required
                />

                <label htmlFor="city" className="sr-only">City</label>
                <input
                    id="city"
                    type="text"
                    className="form-input"
                    name="city"
                    value={form.city}
                    onChange={onChange} 
                    placeholder="City"
                    required
                />

                <label htmlFor="state" className="sr-only">State</label>
                <input
                    id="state"
                    type="text"
                    className="form-input"
                    name="state"
                    value={form.state}
                    onChange={onChange} 
                    placeholder="State Abbreviation (e.g., BA)"
                    required
                />

                <label htmlFor="complement" className="sr-only">Complement</label>
                <input
                    id="complement"
                    type="text"
                    className="form-input"
                    name="complement"
                    value={form.complement}
                    onChange={onChange} 
                    placeholder="Complement (Apartment, Block, Floor)"
                />

                <div className="btn-container">
                    <button className="address-button clear-btn" type="button" onClick={clearForm}>
                        Clear
                    </button>
                    <button className="address-button submit-btn" type="submit">
                        {mode === 'create' ? 'Register' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Container>
    )

}


export default UserAddress