import { type FC, type SubmitEvent, useEffect, useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../routes/path'
import { userForm } from '../../hooks/useForm'
import { authService } from '../../services/auth'
import { Container, PasswordFieldWrapper } from './styled'




const Login:FC = ()=>{
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState<boolean>(false)
    const { form, onChange, clear } = userForm({
        email: 'visitor@email.com',
        password: '123456'
    })


    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            navigate(AppRoutes.HOME)
        }
    }, [navigate])


    const handleLoginSubmit = async(e:SubmitEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault()

        const body = {
            email: form.email,
            password: form.password
        }

        try{
            const data = await authService.login(body)

            localStorage.setItem('token', data.token)
            navigate(AppRoutes.HOME)
        }catch(e:any){
            const errorMessage = e?.response?.data || 'Ocorreu um erro no login. Tente novamente.'
            alert(errorMessage)
        }
    }


    return(
        <Container>
            <div className="title">Login</div>
            <form onSubmit={handleLoginSubmit}>               
                <div className="input-container">
                    <label htmlFor="login-email" className="sr-only">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        className="form-input"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="name@email.com"
                        aria-label="Endereço de email"
                        autoFocus 
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
                    {/* 4. Specified type="button" so this button won't submit the form */}
                    <button className="login-button" type="button" onClick={clear}>Clear</button>
                    <button className="login-button" type="submit">Enter</button>
                </div>
            </form>
        </Container>
    )
}


export default Login