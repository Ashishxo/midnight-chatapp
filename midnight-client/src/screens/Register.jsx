import React from 'react'
import InputField from '../components/InputField'
import { Link } from 'react-router'
import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    fname: '',
    lname: '',
    password: ''
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include', // ⬅️ this is important
      });
      
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      
      toast('User Created Sucessfully',
        {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      navigate('/')
    } catch (err) {
      toast('Error: ' + err.message || 'Error Creating User', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
 
  };

  return (
    
          <form onSubmit={(e)=> e.preventDefault()} className='font-inter text-white flex flex-col gap-5 items-center w-3/4'>

            <div className='mr-auto mb-5'>
              <h1 className='text-5xl font-bold mb-2'>Create an Account</h1>
              <p className='ml-2 text-[1.1rem]'>Already have an account? <Link className='underline' to='/'>Login</Link></p>
            </div>

            

            <InputField className='h-14 text-sm w-full' placeholder='Enter a Username' name='username' value={form.username} onChange={handleChange}/>

            <div className='flex justify-between w-full'>
              <InputField className='h-14 text-sm w-[48.8%]' placeholder='First Name' name='fname' value={form.fname} onChange={handleChange}/>
              <InputField className='h-14 text-sm w-[48.8%]' placeholder='Last Name' name='lname' value={form.lname} onChange={handleChange}/>
            </div>

            <InputField className='h-14 text-sm w-full mb-4' placeholder='Password' name='password' type='password' value={form.password} onChange={handleChange}/>
            <button onClick={handleRegister} className='cursor-pointer h-13 w-full text-xl bg-[#514ED9] hover:bg-[#3331BB] rounded-2xl mb-3 duration-200'>
              Create Account
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

export default Register