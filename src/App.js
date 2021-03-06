import React, { useEffect } from 'react'
import './App.css'
import { Link, Route, useLocation } from 'wouter'

//Mui components
import { Box, Container } from '@mui/material'

//components
import Login from './pages/Login/components/Login'
import Signup from './pages/Signup/components/Signup'
import HomeUser from './pages/HomeUser/Components/HomeUser'

//Store
import useStore from './store/state'

// socket
import { io } from 'socket.io-client'

function App() {
  const user = useStore((state) => state.user)
  const socket = useStore((state) => state.socket)
  const setSocket = useStore((state) => state.setSocket)
  const [, setLocation] = useLocation()

  useEffect(() => {
    setSocket(io())
    setLocation('/')
  }, [setSocket, setLocation])

  useEffect(() => {
    socket?.emit('newUser', user.username)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.username])

  return (
    <Container maxWidth={false} style={{ minWidth: '850px' }}>
      {user?.username ? (
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
                  Login
                </Link>
                <Link href="/signup" className="btn">
                  Sign up
                </Link>
              </Box>
            </Box>
          </Box>
          <Route path="/" component={Login} />
          <Route path="/signup" component={Signup} />
        </>
      )}
    </Container>
  )
}

export default App

