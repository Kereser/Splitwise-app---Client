import React, { useState } from 'react'
import UserService from '../../../services/user'

import { Avatar, Paper } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

//State
import useStore from '../../../store/state'
import AlertComponent from '../../../Components/AlertComponent'

//wouter
import { useLocation } from 'wouter'

//components
import { FlexContainer } from '../../../styledComponents/FlexContainer'
import { Input } from '../../../styledComponents/Input'
import { Button } from '../../../styledComponents/Button'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const setAlert = useStore((state) => state.setAlert)
  const setUser = useStore((state) => state.setUser)
  const [, setLocation] = useLocation()

  const paperStyle = {
    padding: '20px',
    margin: '20px auto',
    width: '300px',
    height: '450px',
  }

  const handleSubmit = async () => {
    try {
      const createdUser = await UserService.create({
        username,
        password,
        name,
      })
      setUser(createdUser)
      setLocation('/Dashboard')
    } catch (err) {
      console.error(err)
      setAlert({
        trigger: true,
        message: err.response.data.message,
        type: 'error',
      })
    }
    setName('')
    setUsername('')
    setPassword('')
  }

  return (
    <FlexContainer>
      <AlertComponent />
      <Paper elevation={10} style={paperStyle}>
        <FlexContainer
          orientation="column"
          style={{ height: '100%' }}
          justifyContent="space-around"
        >
          <FlexContainer orientation="column">
            <Avatar
              style={{
                backgroundColor: '#66b165',
              }}
            >
              <AddCircleOutlineIcon />
            </Avatar>
            <h2 style={{ margin: '12px 0 0' }}>Sign-up</h2>
          </FlexContainer>

          <FlexContainer orientation="column">
            <Input
              placeholder="Username"
              required
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <Input
              placeholder="Name"
              required
              onChange={({ target }) => setName(target.value)}
              value={name}
            />
            <Input
              placeholder="Password"
              required
              onChange={({ target }) => setPassword(target.value)}
              value={password}
              type="password"
            />
            <Button type="submit" onClick={handleSubmit} primary>
              Create account
            </Button>
          </FlexContainer>
        </FlexContainer>
      </Paper>
    </FlexContainer>
  )
}

export default Signup
