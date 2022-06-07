import { useState } from 'react'

//mui components-Icons
import { Avatar, Paper } from '@mui/material'
import VpnKeyIcon from '@mui/icons-material/VpnKey'

// wouter
import { Link, useLocation } from 'wouter'

// Servicelogin
import loginService from '../../../services/login'

// Store
import useStore from '../../../store/state'

//components
import AlertComponent from '../../../Components/AlertComponent'
import { Input } from '../../../styledComponents/Input'
import { Button } from '../../../styledComponents/Button'
import { FlexContainer } from '../../../styledComponents/FlexContainer'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useStore((state) => state.setUser)
  const setAlert = useStore((state) => state.setAlert)
  const [, setLocation] = useLocation()

  const handleClick = async () => {
    try {
      const userLogged = await loginService.login({ username, password })
      setLocation('/Dashboard')
      setUser(userLogged)
    } catch (err) {
      console.log(err)
      setAlert({
        type: 'error',
        message: 'Wrong credentials',
        trigger: true,
      })
    }
  }

  const paperStyle = {
    padding: '20px',
    margin: '20px auto',
    width: '300px',
    height: '400px',
  }

  return (
    <FlexContainer>
      <Paper elevation={10} style={paperStyle}>
        <FlexContainer
          orientation="column"
          style={{ height: '100%' }}
          justifyContent="space-around"
        >
          <FlexContainer orientation="column">
            <Avatar style={{ backgroundColor: '#f50057' }}>
              <VpnKeyIcon />
            </Avatar>
            <h2>Log-in</h2>
          </FlexContainer>

          <FlexContainer orientation="column">
            <Input
              placeholder="Username"
              required
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <Input
              placeholder="Password"
              required
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              type="password"
            />
            <Button type="submit" primary onClick={handleClick}>
              Log-in
            </Button>
            <h5 style={{ padding: '10px 0 0' }}>
              New user?
              <Link href="/signup"> Sign up</Link>
            </h5>
          </FlexContainer>
        </FlexContainer>
      </Paper>
      <AlertComponent />
    </FlexContainer>
  )
}

export default Login
