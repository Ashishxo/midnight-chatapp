import React, { useState } from 'react'
import InputField from '../components/InputField'
import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { login } from '../redux/authSlice/authSlice'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'


function Login() {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  function handleChange(e){
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleLogin = async() => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      const data = await res.json();
      if(!res.ok){
        throw new Error(data.message || "Registration failed");
      }

      

      toast('Login Successful',
        {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      localStorage.setItem('loginTime', Date.now().toString());
      dispatch(login(data.user))

    } catch (error) {
      toast('Error: ' + error.message || 'Error logging in.', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  }

  
  return (
    <form onSubmit={(e)=> e.preventDefault()} className='font-inter text-white flex flex-col gap-5 items-center w-4/6'>

            <div className='mr-auto mb-5'>
              <h1 className='text-[2.5rem] font-bold mb-2'>Log into your account</h1>
              <p className='ml-2 text-[1.1rem]'>Don't have an account? <Link className='underline' to='/register'>Register</Link></p>
            </div>
            
            <InputField className='h-14 text-sm w-full' placeholder='Enter your Username' name='username' value={form.username} onChange={handleChange}/>

            <InputField className='h-14 text-sm w-full mb-4' placeholder='Password' name='password' value={form.password} onChange={handleChange} type='password'/>
            <button onClick={handleLogin} className='cursor-pointer h-13 w-full text-xl bg-[#514ED9] hover:bg-[#3331BB] rounded-2xl mb-3 duration-200'>
              Log In
            </button>
          

            <div className='flex gap-2 w-full items-center mb-3'>
              <span className="flex-grow h-[0.1px] bg-white"></span> 
              <span className='text-lg'>Or signin with</span>
              <span className="flex-grow h-px bg-white"></span> 
            </div>
            
            <div className='cursor-not-allowed h-13 w-full text-xl border-[#666666] border-2 rounded-2xl mb-5 flex items-center justify-center gap-4 hover:bg-white hover:text-black duration-200'>
              <img src="/google.png" className='h-7' alt="" />
              Google
            </div>
           

          </form>
  )
}

export default Login