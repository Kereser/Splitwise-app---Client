import { useState } from 'react'

//mui components
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
} from '@mui/material'

//services
import UserService from '../../../services/user'
import useStore from '../../../store/state'

function FriendDialog({ open, setOpen, user }) {
  const [newFriend, setNewFriend] = useState('')
  const setAlert = useStore((state) => state.setAlert)
  const setUser = useStore((state) => state.setUser)

  const handleClose = () => {
    setOpen(false)
  }

  const handleNewFriend = async () => {
    setOpen(false)

    try {
      const updatedUser = await UserService.update(
        { user, action: { type: 'AddFriend', newFriend } },
        user.id,
      )
      setUser(updatedUser)
      setAlert({
        type: 'success',
        message: `User ${updatedUser.username} added to friends list`,
        trigger: true,
      })
      setNewFriend('')
    } catch (err) {
      console.error(err)
      setAlert({
        type: 'error',
        message: err.response.data.message,
        trigger: true,
      })
    }
  }

  return (
    <Box component={'span'}>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Paper>
            <Box className="title-popup-btn">Add new friend</Box>
          </Paper>
          <Box
            component={'input'}
            className="input"
            placeholder="Enter Username"
            value={newFriend}
            required
            style={{ margin: '20px 0 0' }}
            onChange={(e) => setNewFriend(e.target.value)}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleNewFriend}>Accept</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FriendDialog
