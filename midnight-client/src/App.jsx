import React, { useEffect } from 'react';
import wsClient from './utils/wsConnection';
import Chat from './screens/Chat'
import { Route, Routes } from 'react-router';
import Register from './screens/Register'
import Login from './screens/Login';
import AuthLayout from './screens/Layouts/AuthLayout';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { login, logout } from './redux/authSlice/authSlice';
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch()
  // useEffect(() => {
  //   wsClient.connectWebSocket('ws://localhost:8080');
  // }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (res.ok && data.loggedIn) {
          dispatch(login(data.user));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error("Error checking login:", err);
        dispatch(logout());
      }
    };

    checkLogin();
  }, [dispatch]);

  const {loggedIn: isLoggedIn, loading} = useSelector((state) => state.auth)
  if (loading) {
    return <div className='w-screen h-screen bg-[#424242]'></div>; // or a spinner
  }
  return (
    <>
      <Toaster/>
      <Routes>
            {!isLoggedIn ? (
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Route>
        ) : (
          <>
            <Route path='/' element={<Chat />} />
            <Route path='*' element={<Navigate to='/' />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
