import React from 'react'
import InputField from '../components/InputField'
import { Link } from 'react-router'

function Register() {
  return (
    
          <div className='font-inter text-white flex flex-col gap-5 items-center w-3/4'>

            <div className='mr-auto mb-5'>
              <h1 className='text-5xl font-bold mb-2'>Create an Account</h1>
              <p className='ml-2 text-[1.1rem]'>Already have an account? <Link className='underline' to='/login'>Login</Link></p>
            </div>

            <InputField className='h-14 text-sm w-full' placeholder='Enter a Username'/>

            <div className='flex justify-between w-full'>
              <InputField className='h-14 text-sm w-[48.8%]' placeholder='First Name'/>
              <InputField className='h-14 text-sm w-[48.8%]' placeholder='Last Name'/>
            </div>

            <InputField className='h-14 text-sm w-full mb-4' placeholder='Password'/>
            <button className='h-13 w-full text-xl bg-[#514ED9] hover:bg-[#3331BB] rounded-2xl mb-3 duration-200'>
              Create Account
            </button>

            <div className='flex gap-2 w-full items-center mb-3'>
              <span className="flex-grow h-[0.1px] bg-white"></span> 
              <span className='text-lg'>Or signin with</span>
              <span className="flex-grow h-px bg-white"></span> 
            </div>
            
            <button className='h-13 w-full text-xl border-[#666666] border-2 rounded-2xl mb-5 flex items-center justify-center gap-4 hover:bg-white hover:text-black duration-200'>
              <img src="/google.png" className='h-7' alt="" />
              Google
            </button>
           

          </div>
      
  )
}

export default Register