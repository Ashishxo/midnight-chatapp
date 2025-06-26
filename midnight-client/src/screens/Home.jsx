import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice/authSlice';
import ChatListItem from '../components/ChatListItem';
import Message from '../components/Message';
import { useSelector } from 'react-redux';
import wsClient from '../utils/wsConnection.js'


function Home() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()


  useEffect(() => {
    wsClient.connectWebSocket('ws://localhost:8080');
  }, []);

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState("")
  const [sendMessage, setSendMessage] = useState("")

  const chatRef = useRef(null);
  const activeRoomRef = useRef(activeRoomId);
  useEffect(() => {
    activeRoomRef.current = activeRoomId;
  }, [activeRoomId]);


  const handleRoomSelect = async (roomId, contactName) => {
    setActiveRoomId(roomId);
    setContactName(contactName);
  };

  useEffect(() => {
    if (!activeRoomId) return;

    const fetchChats = async() => {
      try {
        const res = await fetch(`http://localhost:8080/chat/${activeRoomId}?limit=50&skip=0`, {
          method: 'GET',
          credentials: 'include',
        });
    
        const data = await res.json();
        setMessages(data);

      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }      
    }

    fetchChats();
  }, [activeRoomId])
  
    
  
  

  useEffect(() => {
    try {
      async function fetchData(){
        const res = await fetch('http://localhost:8080/chat/chatlist' , {
        method:'GET',
        credentials: 'include',
      });

      const data = await res.json()
      setContacts(data);
      }
      
      fetchData()

    } catch (error) {
      console.log(error)
    }
  }, []);
 

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(()=>{
    wsClient.subscribeToMessages((rawData)=>{
      
      const data = JSON.parse(rawData)
      
      if(data.type === 'message'){

        if (data.roomId === activeRoomRef.current){
          const incomingMsg = {
            _id: Date.now(),
            message: data.body,
            createdAt: new Date(),
            userId: {
              username: data.from || 'Anonymous'
            },
            user: user || {},
          };
          setMessages((prev) => [...prev, incomingMsg]);
        }


        setContacts((prevContacts) => {
          const existing = prevContacts.find((c) => c.roomId === data.roomId);
          if (!existing) return prevContacts;
  
          const updated = {
            ...existing,
            lastMessage: data.body,
            lastMessageAt: new Date(),
          };
  
          const filtered = prevContacts.filter((c) => c.roomId !== data.roomId);
          return [updated, ...filtered];
        });
        
      }
    })
  }, [])


  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8080/auth/logout', {
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


  function handleInputChange(e){
    const msg = e.target.value;
    setSendMessage(msg);
    console.log(msg)
  }

  let chatKey = 1;
  
  function handleSendMessage(){
    let msg = {
      type: 'message',
      body: sendMessage,
      id: activeRoomId
    }

    wsClient.sendMessage(msg);

    msg = {
      _id: chatKey++,
      message: sendMessage,
      createdAt: new Date(),
      userId: {
        username: user.username
      },
      user: user
    }

    setMessages(prev => [...prev, msg]);
    console.log(messages)
  }
 

  return (
    <>


      {/* Main Application Div */}
      <div className='h-screen w-full flex font-inter'>


        {/* Left Options Bar */}
        <div className='h-full w-14 bg-[#514ED9] flex flex-col justify-end items-center'>

          {/* Logout Button */}
          <div className='w-4/6 p-2 rounded-xl hover:bg-[#5c5af2] hover:cursor-pointer h-fit flex items-center justify-center mb-5'>
            <img onClick={handleLogout} src="/logout.png"  />
          </div>
        </div>

        
        <div className='h-full w-full bg-[#212121] flex'>


          {/* Chat List */}
          <div className='w-[30%] bg-[#2B2B2B] h-full rounded-r-[4rem] pl-5 pr-5 pt-24 flex flex-col pb-7'>

            <h1 className='text-white text-4xl font-bold mb-8'>Chats</h1>


            {/* Search Bar */}
            <div className='w-full flex bg-[#212121] rounded-3xl items-center pr-5 p-2 pl-5 mb-8'>
              <input type="text" placeholder='Search a chat' className='min-w-10 text-[#D0D0D0] text-[0.9rem] mr-2 outline-none flex-grow'/>
              <img src="/searchIcon.png" className='h-6 ' />
            </div>

            <div className='overflow-y-scroll flex-grow'>


            {contacts.map(msg => (
              <ChatListItem 
                key={msg.roomId}
                contactName={msg.contactName}
                lastMessage={msg.lastMessage}
                lastMessageAt={new Date(msg.lastMessageAt)}
                roomId={msg.roomId}
                onClick={handleRoomSelect}
                activeRoomId={activeRoomId}
              />
            ))}

      
            </div>

          </div>
          <div className='w-[70%] h-full p-4 flex flex-col'>

            <div className='bg-[#2B2B2B] w-full min-h-[6rem] h-[6rem] rounded-3xl flex items-center pl-10 mb-1'>
              <img src="/profile.png" className='h-14 rounded-full mr-10'/>
              <h1 className='text-white font-bold text-xl font-inter'>{contactName}</h1>
            </div>

            <div className='flex-grow overflow-y-scroll flex flex-col w-full p-5 text-white' ref={chatRef}>

            {messages.map(msg => (
              <Message 
                key={msg._id}
                message={msg.message}
                createdAt={new Date(msg.createdAt)}
                userId={msg.userId.username}
                user={user}
              />
            ))}  

            </div>

            <div className='bg-[#2B2B2B] w-full h-1/11 mb-2 rounded-3xl flex items-center pl-10 pt-4 pb-4 pr-6 gap-4 '>

              <div className='p-3 hover:bg-[#4F4F4F] hover:cursor-pointer rounded-xl'>
                <img src="/imageIcon.png" className='h-6' />
              </div>
              
              <input type="text" className='text-white text-[1rem] w-full h-full pl-3 outline-none' placeholder='Type a Message' value={sendMessage} onChange={handleInputChange}/>
              <button className='hover:bg-[#4F4F4F] hover:cursor-pointer rounded-xl p-4' onClick={handleSendMessage}>
                <img src="/send.png" className='h-4'/>
              </button>

            </div>
            
          </div>

        </div>
      </div>
    </>
  );
}

export default Home;
