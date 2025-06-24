import React, { useEffect } from 'react';
import wsClient from './utils/wsConnection';
import Chat from './screens/Chat'
import { Route, Routes } from 'react-router';
import Register from './screens/Register'
import Login from './screens/Login';
import AuthLayout from './screens/Layouts/AuthLayout';

function App() {
  useEffect(() => {
    wsClient.connectWebSocket('ws://localhost:8080');
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<AuthLayout />}>
          <Route index element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
