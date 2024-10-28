import React from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const {login} = useAuth()
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        login();
        navigate("/");
    }
  return (
    <div>LoginPage
        <button onClick={handleLogin} className='bg-green-200 p-1 px-4 m-3'>login</button>
    </div>
  )
}

export default LoginPage