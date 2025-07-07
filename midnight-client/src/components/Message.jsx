import React from 'react'
import { format, isToday, isYesterday } from 'date-fns'

function Message({ message, createdAt, userId, user }) {
  const own = user.username === userId

  const createdDate = new Date(createdAt)

  let dateLabel = ''
  if (isToday(createdDate)) {
    dateLabel = 'Today'
  } else if (isYesterday(createdDate)) {
    dateLabel = 'Yesterday'
  } else {
    dateLabel = format(createdDate, 'dd/MM/yy')
  }

  const timeOnly = format(createdDate, 'HH:mm') // 24-hour format

  const displayTime = `${dateLabel} ${timeOnly}`

  return (
    <>
      {own ? (
        <div className='w-full flex justify-end'>
          <div className='max-w-[70%] w-fit flex flex-col mb-2 mr-2 items-center'>
            <p className='bg-[#514ED9] w-fit p-4 rounded-l-2xl rounded-tr-2xl font-inter font-light text-[1.rem] break-words'>
              {message}
            </p>
            <span className='self-end mr-2 mt-1 text-[0.7rem] font-inter font-light'>
              {displayTime}
            </span>
          </div>
        </div>
      ) : (
        <div className='w-full'>
          <div className='max-w-[70%] w-fit flex flex-col mb-2'>
            <p className='bg-[#2B2B2B] w-fit p-4 rounded-r-2xl rounded-tl-2xl font-inter font-light text-[1.rem] break-words'>
              {message}
            </p>
            <span className='self-start ml-1 mt-1 text-[0.7rem] font-inter font-light'>
              {displayTime}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Message
