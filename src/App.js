import React, { useEffect } from 'react'
import './App.css'
import { Link, Route } from 'wouter'

//Mui components
import { Box, Container } from '@mui/material'
import Login from './Components/Login'
import Home from './Components/Home'
import Signup from './Components/Signup'
import useStore from './store/state'
import HomeUser from './Components/HomeUser/HomeUser.js'

// socket
import { io } from 'socket.io-client'

function App() {
  const user = useStore((state) => state.user)
  const socket = useStore((state) => state.socket)
  const setSocket = useStore((state) => state.setSocket)

  useEffect(() => {
    setSocket(io('http://localhost:3001'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    socket?.emit('newUser', user.username)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.username])

  return (
    <Container maxWidth={false} style={{ minWidth: '850px' }}>
      {user.username ? (
        <HomeUser />
      ) : (
        <>
          <Box component={'header'} className="header">
            <Box className="flex-container">
              <Box className="icon">
                <Link href="/">
                  <i className="fa-solid fa-spaghetti-monster-flying"></i>
                </Link>
              </Box>
              <Box>
                <Link href="/" className="btn">
                  Home
                </Link>
                <Link href="login" className="btn">
                  Login
                </Link>
                <Link href="/signup" className="btn">
                  Sign up
                </Link>
              </Box>
            </Box>
          </Box>
          <Route path="/login" component={Login} />
          <Route path="/" component={Home} />
          <Route path="/signup" component={Signup} />
        </>
      )}
    </Container>
  )
}

export default App

