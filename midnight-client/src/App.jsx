import React, { useEffect } from 'react';
import wsClient from './utils/wsConnection';
import Chat from './screens/Chat'

function App() {
  useEffect(() => {
    wsClient.connectWebSocket('ws://localhost:8080');
  }, []);

  return (
    <div>
      <Chat />
    </div>
  );
}

export default App;
