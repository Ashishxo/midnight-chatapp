import React from 'react'

function ChatListItem({ contactName, lastMessage, lastMessageAt, roomId, onClick, activeRoomId }) {
    const style = (activeRoomId === roomId) ? 'text-white w-full h-23 bg-[#514ED9] rounded-4xl mb-4 flex items-center p-5 gap-1 hover:bg-[#615EE9]' : 'text-white w-full h-23 bg-[#3F3F3F] hover:bg-[#4F4F4F] rounded-4xl mb-4 flex items-center p-5 gap-1';
    const timeOnly = lastMessageAt.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
  return (
    <div onClick={() => onClick(roomId, contactName)} className={style}>

                  <img src="/profile.png" className='h-13 rounded-full' />
                  <div className='pl-4 h-full flex-grow overflow-hidden'> 
                    <h3 className='font-bold text-[1rem] truncate whitespace-nowrap w-full mb-1'>{contactName}</h3>
                    <p className='truncate text-[0.8rem]'>{lastMessage}</p>
                  </div>
                  <div className='h-full'>
                      <h3 className='text-[0.8rem]'>{timeOnly}</h3>
                  </div>

    </div>
  )
}

export default ChatListItem