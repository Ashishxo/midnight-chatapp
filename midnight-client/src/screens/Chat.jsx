import React, { useState, useEffect } from 'react';
import wsClient from '../utils/wsConnection';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice/authSlice';


function Chat() {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('');
  const chatRef = useRef(null);
  let messages= []

 

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);


  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (res.ok) {
        dispatch(logout()); 
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  

  // useEffect(() => {
  //   wsClient.subscribeToMessages((msg) => {
  //     setMessage(msg); 
  //   });
  // }, []);

  return (
    <>
      <div className='h-screen w-full flex font-inter'>
        <div className='h-full w-14 bg-[#514ED9] flex flex-col justify-end items-center'>
          <img onClick={handleLogout} src="/logout.png" className='w-1/2 mb-5' />
        </div>
        <div className='h-full w-full bg-[#212121] flex'>

          <div className='w-[30%] bg-[#2B2B2B] h-full rounded-r-[4rem] pl-5 pr-5 pt-24 flex flex-col pb-7'>

            <h1 className='text-white text-4xl font-bold mb-8'>Chats</h1>

            <div className='w-full flex bg-[#212121] rounded-3xl items-center pr-5 p-2 pl-5 mb-8'>
              <input type="text" placeholder='Search a chat' className='text-[#D0D0D0] text-[0.9rem] mr-2 outline-none flex-grow'/>
              <img src="/searchIcon.png" className='h-6 ' />
            </div>

            <div className='overflow-y-scroll flex-grow'>

              <div className='text-white w-full h-23 bg-[#514ED9] rounded-4xl mb-4 flex items-center p-5 gap-1'>

                  <img src="/hasya.png" className='h-13 rounded-full' />
                  <div className='pl-4 h-full flex-grow overflow-hidden'> 
                    <h3 className='font-bold text-[1rem] truncate whitespace-nowrap w-full mb-1'>hasya</h3>
                    <p className='truncate text-[0.8rem]'>karrha hu.. server ka code hogaya achha khasa</p>
                  </div>
                  <div className='h-full'>
                      <h3 className='text-[0.8rem]'>22:09</h3>
                  </div>

              </div>

              <div className='text-white w-full h-23 bg-[#3F3F3F] rounded-4xl mb-4 flex items-center p-5 gap-1'>

                <img src="/heramb.png" className='h-13 rounded-full' />
                <div className='pl-4 h-full flex-grow overflow-hidden'> 
                  <h3 className='font-bold text-[1rem] truncate whitespace-nowrap w-full mb-1'>heramb</h3>
                  <p className='truncate text-[0.8rem]'>ding ding</p>
                </div>
                <div className='h-full'>
                    <h3 className='text-[0.8rem]'>22:09</h3>
                </div>

              </div>

              <div className='text-white w-full h-23 bg-[#3F3F3F] rounded-4xl mb-4 flex items-center p-5 gap-1'>

                <img src="/sneha.png" className='h-13 rounded-full' />
                <div className='pl-4 h-full flex-grow overflow-hidden'> 
                  <h3 className='font-bold text-[1rem] truncate whitespace-nowrap w-full mb-1'>sneha</h3>
                  <p className='truncate text-[0.8rem]'>mard jaat</p>
                </div>
                <div className='h-full'>
                    <h3 className='text-[0.8rem]'>22:09</h3>
                </div>

              </div>

              <div className='text-white w-full h-23 bg-[#3F3F3F] rounded-4xl mb-4 flex items-center p-5 gap-1'>

                <img src="/heramb.png" className='h-13 rounded-full' />
                <div className='pl-4 h-full flex-grow overflow-hidden'> 
                  <h3 className='font-bold text-[1rem] truncate whitespace-nowrap w-full mb-1'>heramb</h3>
                  <p className='truncate text-[0.8rem]'>ding ding</p>
                </div>
                <div className='h-full'>
                    <h3 className='text-[0.8rem]'>22:09</h3>
                </div>

              </div>

              <div className='text-white w-full h-23 bg-[#3F3F3F] rounded-4xl mb-4 flex items-center p-5 gap-1'>

                <img src="/sneha.png" className='h-13 rounded-full' />
                <div className='pl-4 h-full flex-grow overflow-hidden'> 
                  <h3 className='font-bold text-[1rem] truncate whitespace-nowrap w-full mb-1'>sneha</h3>
                  <p className='truncate text-[0.8rem]'>mard jaat</p>
                </div>
                <div className='h-full'>
                    <h3 className='text-[0.8rem]'>22:09</h3>
                </div>

              </div>

              

            </div>

          </div>
          <div className='w-[70%] h-full p-4 flex flex-col'>

            <div className='bg-[#2B2B2B] w-full h-1/6 rounded-3xl flex items-center pl-10 mb-1'>
              <img src="/hasya.png" className='h-14 rounded-full mr-10'/>
              <h1 className='text-white font-bold text-xl font-inter'>hasya</h1>
            </div>

            <div className='flex-grow overflow-y-scroll flex flex-col w-full p-5 text-white' ref={chatRef}>

              <div className='h-20 max-w-[70%] w-fit flex flex-col mb-2'>
                <p className='bg-[#2B2B2B] w-full p-4 rounded-r-2xl rounded-tl-2xl font-inter font-light text-[1.rem] break-words'>good morning</p>
                <span className='self-start ml-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>

              <div className='h-20 max-w-[70%] w-fit flex flex-col self-end'>
                <p className='bg-[#514ED9] w-full p-4 rounded-l-2xl rounded-tr-2xl font-inter font-light text-[1.rem] break-words'>good morning</p>
                <span className='self-end mr-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>


              <div className='h-20 max-w-[70%] w-fit flex flex-col mb-2'>
                <p className='bg-[#2B2B2B] w-full p-4 rounded-r-2xl rounded-tl-2xl font-inter font-light text-[1.rem] break-words'>wyd</p>
                <span className='self-start ml-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>

              <div className='h-20 max-w-[70%] w-fit flex flex-col self-end'>
                <p className='bg-[#514ED9] w-full p-4 rounded-l-2xl rounded-tr-2xl font-inter font-light text-[1.rem] break-words'>abhi utha hu.. padhai start karunga abhi</p>
                <span className='self-end mr-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>


              <div className='h-20 max-w-[70%] w-fit flex flex-col mb-2'>
                <p className='bg-[#2B2B2B] w-full p-4 rounded-r-2xl rounded-tl-2xl font-inter font-light text-[1.rem] break-words'>okk</p>
                <span className='self-start ml-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>

              <div className='h-20 max-w-[70%] w-fit flex flex-col self-end'>
                <p className='bg-[#514ED9] w-full p-4 rounded-l-2xl rounded-tr-2xl font-inter font-light text-[1.rem] break-words'>abhi break liya</p>
                <span className='self-end mr-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>


              <div className='h-20 max-w-[70%] w-fit flex flex-col mb-2'>
                <p className='bg-[#2B2B2B] w-full p-4 rounded-r-2xl rounded-tl-2xl font-inter font-light text-[1.rem] break-words'>kitna hua</p>
                <span className='self-start ml-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>

              <div className='h-20 max-w-[70%] w-fit flex flex-col self-end'>
                <p className='bg-[#514ED9] w-full p-4 rounded-l-2xl rounded-tr-2xl font-inter font-light text-[1.rem] break-words'>karrha hu.. server ka code hogaya achha khasa</p>
                <span className='self-end mr-4 mt-1 text-[0.7rem] font-inter font-light'>22:09</span>
              </div>

            </div>

            <div className='bg-[#2B2B2B] w-full h-1/11 mb-2 rounded-3xl flex items-center pl-10 pt-4 pb-4 pr-6 gap-6 '>

              <img src="/imageIcon.png" className='h-5' />
              <input type="text" className='text-white text-[1rem] w-full h-full pl-3 outline-none' placeholder='Type a Message'/>
              <button className=' rounded-2xl pr-2'>
                <img src="/send.png" className='h-4'/>
              </button>

            </div>
            
          </div>

        </div>
      </div>
    </>
  );
}

export default Chat;
