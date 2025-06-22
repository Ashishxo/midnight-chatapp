import React, { useState, useEffect } from 'react';
import wsClient from '../utils/wsConnection';

function Chat() {
  const [message, setMessage] = useState('');

  function sendWSMessage(){
    wsClient.sendMessage()
  }

  useEffect(() => {
    // Subscribe to messages from the WebSocket
    wsClient.subscribeToMessages((msg) => {
      setMessage(msg); // Update message with incoming server message
    });
  }, []);

  return (
    <>
      <div className='flex flex-col justify-center align-middle mt-4'>
        <div className='text-4xl text-center'>Chat</div>
        <div className='flex justify-center'><span>{ message }</span></div>
        <button onClick={sendWSMessage} className='border-2 border-black rounded-3xl p-2 w-50'>Send Hi</button>
      </div>
    </>
  );
}

export default Chat;
