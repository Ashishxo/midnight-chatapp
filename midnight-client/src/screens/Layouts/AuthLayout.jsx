import React from 'react';
import { Outlet, useLocation } from 'react-router';


function AuthLayout() {
  const location = useLocation();

  return (
    <div className='h-screen bg-[#212121] flex md:p-6 gap-10 justify-center'>
        

      <div className='w-[46%] bg-linear-120 from-[#3C00FF] to-[#240099] rounded-4xl hidden md:flex justify-center items-center'>
        <img src="/logoName.png" className='w-2/3' />
      </div>

      <div className='w-full md:w-[48%] flex justify-center items-center'>
       
                <Outlet />
            
      </div>
    </div>
  );
}

export default AuthLayout;
