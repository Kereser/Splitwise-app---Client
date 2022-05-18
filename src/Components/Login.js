import { useState } from 'react'

//mui components
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import VpnKeyIcon from '@mui/icons-material/VpnKey'

// wouter
import { Link, useLocation } from 'wouter'

// Servicelogin
import loginService from '../services/login'

// Store
import useStore from '../store/state'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useStore((state) => state.setUser)
  const [, setLocation] = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(username, password)
    try {
      const userLogged = await loginService.login({ username, password })
      console.log('User logged: ', userLogged)
      setLocation('/Dashboard')
      setUser(userLogged)
    } catch (err) {
      console.log(err)
      alert('Wrong credentials')
    }
  }

  const paperStyle = {
    padding: '20px',
    margin: '20px auto',
    width: '300px',
    height: '70vh',
  }

  const avatarStyle = {
    backgroundColor: '#f50057',
  }

  const btnStyle = {
    margin: '8px 0',
  }

  const textStyle = {
    margin: '4px 0',
  }

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          style={{ height: '100%' }}
        >
          <Grid align="center" item xs={3}>
            <Avatar style={avatarStyle}>
              <VpnKeyIcon />
            </Avatar>
            <Typography variant="h5" style={{ padding: '10px 0' }}>
              Log-in
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Username"
              variant="standard"
              placeholder="Username"
              required
              fullWidth
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              style={textStyle}
            />
            <TextField
              variant="standard"
              label="Password"
              placeholder="Password"
              required
              fullWidth
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              type="password"
              style={textStyle}
            />
            <Button
              type="submit"
              size="small"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              style={btnStyle}
            >
              Sign in
            </Button>
            <Typography variant="body2" style={{ padding: '5px 0' }}>
              New user?
              <Link href="/signup"> Sign up</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default Login
