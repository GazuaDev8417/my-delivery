import { type FC, type SubmitEvent, useEffect, useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../routes/path'
import { userForm } from '../../hooks/useForm'
import { authService } from '../../services/auth'
import { handleKeyPress } from '../../utils/inputsAndKeys'
import { useAuth } from '../../global/AuthContext'
import { Container, PasswordFieldWrapper } from './styled'




const Signup:FC = ()=>{
    const navigate = useNavigate()
    const { login } = useAuth()
    const [showPass, setShowPass] = useState<boolean>(false)
    const { form, onChange, clear } = userForm({
        name: '',
        email: '',
        phone: '',
        password: ''
    })


    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            navigate(AppRoutes.HOME)
        }
    }, [navigate])


    const handleSignupSubmit = async(e:SubmitEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault()

        const body = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password
        }

        try{
            const tokenData = await authService.signup(body)
            login(tokenData)

            localStorage.setItem('token', tokenData)
            navigate(AppRoutes.ADDRESS)
        }catch(e:any){
            const errorMessage = e?.response?.data?.message || e?.response?.data || e?.message
            alert(errorMessage)
        }
    }




    return(
        <Container>
            <div className="title">Register User</div>
            <form onSubmit={handleSignupSubmit}>               
                <div className="input-container">
                    <label htmlFor="login-email" className="sr-only">Email</label>
                    <input
                        id="login-email"
                        type="text"
                        className="form-input"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Your full name"
                        aria-label="Customer name"
                        autoFocus 
                        required
                        />

                    <input
                        id="login-email"
                        type="email"
                        className="form-input"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="name@email.com"
                        aria-label="Endereço de email"
                        required
                        />

                    <input
                        id="login-email"
                        type="text"
                        className="form-input"
                        name="phone"
                        maxLength={11}
                        onKeyDown={handleKeyPress}
                        value={form.phone}
                        onChange={onChange}
                        placeholder="Phone number"
                        aria-label="Customer telefone"
                        required
                        />
                    
                    <PasswordFieldWrapper>
                        <label htmlFor="login-password" className="sr-only">Senha</label>
                        <input
                            id="login-password"
                            type={!showPass ? 'password' : 'text'}
                            name="password"
                            className="form-input"
                            value={form.password}
                            onChange={onChange} 
                            placeholder="Sua senha"
                            aria-label="Senha"
                            required
                            />
                        {
                        !showPass ? (
                            <FaEyeSlash onClick={() => setShowPass(true)} className='eye-icon' />
                        ) : <FaEye onClick={() => setShowPass(false)} className='eye-icon' />
                        }
                    </PasswordFieldWrapper>
                </div>
                <div className="btn-container">
                    <div className='submit-btn'>
                        <button className="login-button" type="button" onClick={clear}>Clear</button>
                        <button className="login-button" type="submit">Enter</button>
                    </div>
                    <button 
                        className="signup-button signup-button-exception"
                        type="button"
                        onClick={() => navigate(AppRoutes.LOGIN, { state: { mode: 'create' } })}
                    >
                        Back to Lgin
                    </button>
                </div>
            </form>
        </Container>
    )
}


export default Signup