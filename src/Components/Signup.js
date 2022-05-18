import React, { useState } from 'react'
import UserService from '../services/user'

import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

//State
import useStore from '../store/state'
import AlertComponent from './HomeUser/AlertComponent'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const setAlert = useStore((state) => state.setAlert)
  const setUser = useStore((state) => state.setUser)

  const paperStyle = {
    padding: '20px',
    margin: '20px auto',
    width: '300px',
    height: '70vh',
  }

  const avatarStyle = {
    backgroundColor: '#66b165',
  }

  const btnStyle = {
    margin: '8px 0',
  }

  const textStyle = {
    margin: '4px 0',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(username, password, name)
    try {
      const createdUser = await UserService.create({ username, password, name })
      setUser(createdUser)
    } catch (err) {
      console.error(err)
      console.log('Entro al error')
      setAlert({
        trigger: true,
        message: 'Could not create a new user because username already exists.',
        type: 'error',
      })
    }
    setName('')
    setUsername('')
    setPassword('')
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
              <AddCircleOutlineIcon />
            </Avatar>
            <Typography variant="h5" style={{ padding: '10px 0' }}>
              Sign-up
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Username"
              variant="standard"
              placeholder="Username"
              required
              fullWidth
              onChange={({ target }) => setUsername(target.value)}
              value={username}
              style={textStyle}
            />
            <TextField
              variant="standard"
              label="Name"
              placeholder="Name"
              required
              fullWidth
              onChange={({ target }) => setName(target.value)}
              value={name}
              style={textStyle}
            />
            <TextField
              variant="standard"
              label="Password"
              placeholder="Password"
              required
              fullWidth
              onChange={({ target }) => setPassword(target.value)}
              value={password}
              type="password"
              style={textStyle}
            />
            <Button
              type="submit"
              size="small"
              fullWidth
              onClick={handleSubmit}
              variant="contained"
              style={btnStyle}
            >
              Create account
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <AlertComponent />
    </Grid>
  )
}

export default Signup
