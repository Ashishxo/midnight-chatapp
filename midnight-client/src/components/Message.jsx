import React from 'react'

function Message({message, createdAt, userId, user}) {

  let own = user.username == userId
  console.log(own)

    const timeOnly = createdAt.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
  return (
    <>

    {own? (
    <div className='w-full flex justify-end '>
      <div className='max-w-[70%] w-fit flex flex-col mb-2 mr-2'>
        <p className='bg-[#514ED9] w-full p-4 rounded-l-2xl rounded-tr-2xl font-inter font-light text-[1.rem] break-words'>{message}</p>
        <span className='self-end mr-4 mt-1 text-[0.7rem] font-inter font-light'>{timeOnly}</span>
      </div>
    </div>
    ):(
      <div className='w-full'>
        <div className='max-w-[70%] w-fit flex flex-col mb-2'>
          <p className='bg-[#2B2B2B] w-full p-4 rounded-r-2xl rounded-tl-2xl font-inter font-light text-[1.rem] break-words'>{message}</p>
          <span className='self-start ml-4 mt-1 text-[0.7rem] font-inter font-light'>{timeOnly}</span>
        </div>
      </div>
    )}
    
    
    

    </>
  )
}

export default Message