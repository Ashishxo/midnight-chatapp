import React from 'react';
import { Outlet, useLocation } from 'react-router';

function AuthLayout() {
  const location = useLocation();

  return (
    <div className='h-screen bg-[#2B2B2B] flex p-6 gap-10 justify-center'>

      <div className='w-[46%] bg-linear-120 from-[#3C00FF] to-[#240099] rounded-4xl flex justify-center items-center'>
        <img src="/logoName.png" className='h-52' />
      </div>

      <div className='w-[48%] flex justify-center items-center overflow-hidden'>
       
                <Outlet />
            
      </div>
    </div>
  );
}

export default AuthLayout;
