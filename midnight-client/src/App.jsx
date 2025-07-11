import React, { useEffect } from 'react';
import wsClient from './utils/wsConnection';
import Home from './screens/Home'
import { Route, Routes } from 'react-router';
import Register from './screens/Register'
import Login from './screens/Login';
import AuthLayout from './screens/Layouts/AuthLayout';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { login, logout } from './redux/authSlice/authSlice';


function App() {
  const dispatch = useDispatch()
  // useEffect(() => {
  //   wsClient.connectWebSocket('ws://localhost:8080');
  // }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/check-auth`, {
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
      
      <Routes>
            {!isLoggedIn ? (
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Route>
        ) : (
          <>
            <Route path='/' element={<Home />} />
            <Route path='*' element={<Navigate to='/' />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
