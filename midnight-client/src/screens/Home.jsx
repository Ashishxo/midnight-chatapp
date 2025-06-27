import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice/authSlice';
import ChatListItem from '../components/ChatListItem';
import Message from '../components/Message';
import { useSelector } from 'react-redux';
import wsClient from '../utils/wsConnection.js'
import InputField from '../components/InputField.jsx';
import toast from 'react-hot-toast';
import { Virtuoso } from 'react-virtuoso';

function ChatList({ messages, user, fetchOlderChats, hasMore, loadingMore, skip, atBottom, setAtBottom, virtuosoRef }) {


  return (
    <Virtuoso
      ref={virtuosoRef}
      data={messages}
      firstItemIndex={100000 - skip}
      itemContent={(index, msg) => (
        <Message
          key={msg._id}
          message={msg.message}
          createdAt={new Date(msg.createdAt)}
          userId={msg.userId.username}
          user={user}
        />
      )}
      startReached={() => {
        if (hasMore && !loadingMore) {
          fetchOlderChats();
        }
      }}

      atBottomStateChange={(isAtBottom) => setAtBottom(isAtBottom)}
      followOutput={atBottom ? 'smooth' : false}
      
      initialTopMostItemIndex={messages.length - 1}
      components={{
        Header: () =>
          loadingMore ? (
            <div className="flex justify-center py-2 text-white text-sm opacity-60">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Loading older messages...
            </div>
          ) : null,
      }}
      style={{ height: '100%', width: '100%' }}
    />
  );
}





function Home() {
  const virtuosoRef = useRef(null);

  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  


  const fetchOlderChats = () => {
    fetchChats(true);
  };

  useEffect(() => {
    wsClient.connectWebSocket(`${import.meta.env.VITE_WS_URL}`);
  }, []);

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState("")
  const [sendMessage, setSendMessage] = useState("")
  const [addUser, setAddUser] = useState(false)
  const [newContact, setNewContact] = useState("")
  const [loadingChats, setLoadingChats] = useState(false)
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [atBottom, setAtBottom] = useState(true);


  const atBottomRef = useRef(true);

  useEffect(() => {
    atBottomRef.current = atBottom;
  }, [atBottom]);



  //const chatRef = useRef(null);
  const activeRoomRef = useRef(activeRoomId);
  useEffect(() => {
    activeRoomRef.current = activeRoomId;
  }, [activeRoomId]);


  const handleRoomSelect = async (roomId, contactName) => {
    setSkip(0);
    setHasMore(true);
    setMessages([]);

    setLoadingChats(true);
    setActiveRoomId(roomId);
    setContactName(contactName);
  };

  const fetchChats = async(append = false) => {
    if (!activeRoomId) return;
    try {
      if (loadingMore || (!hasMore && append)) return;

      if (append) setLoadingMore(true);
      else setLoadingChats(true);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${activeRoomId}?limit=20&skip=${append ? skip : 0}`, {
        method: 'GET',
        credentials: 'include',
      });
  
      const data = await res.json();
      
      if (data.length < 20) setHasMore(false);

      if (append) {
        setMessages(prev => [...data, ...prev]);
        setSkip(prev => prev + data.length);
      } else {
        setMessages(data);
        setSkip(data.length);
      }

    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally{
      if (append) setLoadingMore(false);
      else setLoadingChats(false);
    } 
  }


  useEffect(() => {
  
    fetchChats();
  }, [activeRoomId])
  
    
  
  

  useEffect(() => {
    try {
      async function fetchData(){
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/chatlist` , {
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
 

  // useEffect(() => {
  //   if (chatRef.current) {
  //     chatRef.current.scrollTop = chatRef.current.scrollHeight;
  //   }
  // }, [messages]);

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
          setMessages(prev => {
            const updated = [...prev, incomingMsg];
          
            // Only scroll if we're at the bottom
            if (atBottomRef.current && virtuosoRef.current) {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  virtuosoRef.current.scrollToIndex({
                    index: updated.length - 1,
                    behavior: 'smooth',
                  });
                }, 50);
              });
            }
          
            return updated;
          });
          
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
        return;
      }

      if(data.type === "error"){
        toast('Error: ' + data.body || 'Error processing request.', {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });

        return
      }

      if(data.type === "room-init"){
        const userList = data.roomId.split('_')
        const newContactName = userList.find((u)=> u !== user.username) || "Unknown"
        let newRoom = {
          roomId: data.roomId,
          contactName: newContactName,
          lastMessage: "",
          lastMessageAt: null
        }

        setContacts((prevContacts) => {
          const alreadyExists = prevContacts.some(contact => contact.roomId === data.roomId);
          if (alreadyExists) return prevContacts;
          return [newRoom, ...prevContacts];
        })

       
          toast(`${newContactName} was added as a friend!`,
            {
              icon: '👋🏻',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }
          );
        
        setAddUser(false)
      }

    })
  }, [])


  const handleLogout = async () => {

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (res.ok) {
        wsClient.closeWebSocket();
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
  }

  let chatKey = 1;
  
  function handleSendMessage(){
    let msg = {
      type: 'message',
      body: sendMessage,
      id: activeRoomId
    }
    if(sendMessage == "") return;
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

    setMessages(prev => {
      const updated = [...prev, msg];
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: updated.length - 1,
          behavior: 'smooth',
        });
      }, 50);
      return updated;
    });

    setSendMessage("");

    setContacts((prevContacts) => {
      const existing = prevContacts.find((c) => c.roomId === activeRoomId);
      if (!existing) return prevContacts;

      const updated = {
        ...existing,
        lastMessage: sendMessage,
        lastMessageAt: new Date(),
      };

      const filtered = prevContacts.filter((c) => c.roomId !== activeRoomId);
      return [updated, ...filtered];
    });
  }

  function handleRoomRequest(){
    let msg = {
      type: "room-init",
      body: "New Room Request",
      id: newContact
    }

    wsClient.sendMessage(msg)
  }




  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const expiry = 30 * 60 * 1000; // 30 minutes in milliseconds
      const now = Date.now();
      const remaining = expiry - (now - parseInt(loginTime, 10));
  
      if (remaining <= 0) {
        handleLogout(); // Your logout logic
      } else {
        const timeout = setTimeout(() => {
          handleLogout();
        }, remaining);
  
        return () => clearTimeout(timeout); // Cleanup if unmounted
      }
    }
  }, []);
  

  return (
    <>
      {addUser? (<div className='z-10 backdrop-blur-sm w-screen h-screen fixed flex justify-center items-center'>
        <div className='w-fit min-w-[28rem] min-h-1/4 bg-[#2B2B2B] opacity-100 rounded-2xl text-white p-5 flex flex-col items-center font-inter'>
          
          <div className='w-full flex justify-end pr-4 '> 
            <div className='rounded-xl hover:bg-[#3F3F3F] p-2 cursor-pointer' onClick={()=> {setAddUser((state) => !state);}}>
              <img src="/close.png" className='h-4'/>
            </div>
            
          </div>
          <h1 className='font-bold text-2xl mb-4 '>Add a Friend</h1>
          <InputField className='h-12 text-sm w-6/8 mb-2' placeholder='Enter a Username' name='username' value={newContact} onChange={(e) => {setNewContact(e.target.value);}}/>
          <button onClick={handleRoomRequest} className='bg-[#514ED9] rounded-2xl w-6/8 h-12 text-sm p-3 font-medium mb-4 hover:bg-[#7f7dd2] cursor-pointer'>Add User</button>
        </div>
      
      </div>):(<></>)}

      {/* Main Application Div */}
      <div className='h-screen w-full flex font-inter'>


        {/* Left Options Bar */}
        <div className='h-full w-14 bg-[#514ED9] flex flex-col justify-end items-center'>


          <div className='w-4/6 p-2 rounded-xl hover:bg-[#5c5af2] hover:cursor-pointer h-fit flex items-center justify-center mb-5'>
            <img onClick={()=> {setAddUser((state) => !state);}} src="/newUser.png"  />
          </div>

          {/* Logout Button */}
          <div className='w-4/6 p-2 rounded-xl hover:bg-[#5c5af2] hover:cursor-pointer h-fit flex items-center justify-center mb-5'>
            <img onClick={handleLogout} src="/logout.png"  />
          </div>
        </div>

        
        <div className='h-full w-full bg-[#212121] flex'>


          {/* Chat List */}
          <div className='w-[30%] bg-[#2B2B2B] h-full rounded-r-[3.5rem] pl-5 pr-5 pt-24 flex flex-col pb-7'>

            <h1 className='text-white text-4xl font-bold mb-8'>Chats</h1>


            {/* Search Bar */}
            <div className='cursor-not-allowed w-full flex bg-[#212121] rounded-3xl items-center pr-5 p-2 pl-5 mb-8 '>
              <input type="text" placeholder='Search a chat' className='cursor-not-allowed min-w-10 text-[#D0D0D0] text-[0.9rem] mr-2 outline-none flex-grow'/>
              <img src="/searchIcon.png" className='cursor-not-allowed h-6 ' />
            </div>

            <div className='overflow-y-scroll flex-grow'>


            {contacts.map(msg => (
              <ChatListItem 
                key={msg.roomId}
                contactName={msg.contactName}
                lastMessage={msg.lastMessage}
                lastMessageAt={msg.lastMessageAt ? new Date(msg.lastMessageAt) : null}
                roomId={msg.roomId}
                onClick={handleRoomSelect}
                activeRoomId={activeRoomId}
              />
            ))}

      
            </div>

          </div>

          {activeRoomId ? (
          <>
            {loadingChats? (

              <div className='w-[70%] h-full p-4 flex flex-col justify-center items-center'>
                <img src="/greyLogo.png" className='h-8 mb-4' />
                <p className='text-2xl font-medium font-mono text-[#5F5F5F]'>Loading...</p>
              </div>

            ):(<>
            
              <div className='w-[70%] h-full p-4 flex flex-col'>

                <div className='bg-[#2B2B2B] w-full min-h-[6rem] h-[6rem] rounded-3xl flex items-center pl-10 mb-1'>
                  <img src="/profile.png" className='h-14 rounded-full mr-10'/>
                  <h1 className='text-white font-bold text-xl font-inter'>{contactName}</h1>
                </div>

                <div className='flex-grow w-full px-5 text-white'>
               <ChatList
                messages={messages}
                user={user}
                fetchOlderChats={fetchOlderChats}
                hasMore={hasMore}
                loadingMore={loadingMore}
                skip={skip}
                atBottom={atBottom}
                setAtBottom={setAtBottom} 
                virtuosoRef={virtuosoRef}
              />

                </div>


                <div className='bg-[#2B2B2B] w-full h-1/11 mb-2 rounded-3xl flex items-center pl-10 pt-4 pb-4 pr-6 gap-4 '>

                  <div className='cursor-not-allowed p-3 hover:bg-[#4F4F4F] rounded-xl'>
                    <img src="/imageIcon.png" className='cursor-not-allowed h-6' />
                  </div>
                  
                  
                  <input type="text" className='text-white text-[1rem] w-full h-full pl-3 outline-none' 
                  placeholder='Type a Message' 
                  
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); 
                      handleSendMessage();
                    }
                  }} 
                  value={sendMessage} 
                  onChange={handleInputChange}/>


                  <button className='hover:bg-[#4F4F4F] cursor-pointer rounded-xl p-4' onClick={handleSendMessage}>
                    <img src="/send.png" className='h-4'/>
                  </button>

                </div>
                
              </div>
            
            </>)}
            
            
          
          
          </>
          ):(


            <div className='w-[70%] h-full p-4 flex flex-col justify-center items-center'>
              <img src="/greyLogo.png" className='h-8 mb-4' />
              <p className='text-2xl font-medium font-mono text-[#5F5F5F]'>Welcome to Midnight Chat App</p>
            </div>
          
          )}
          

        </div>
      </div>
    </>
  );
}

export default Home;