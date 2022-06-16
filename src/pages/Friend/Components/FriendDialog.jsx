import { useState } from 'react'

//mui components
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
} from '@mui/material'

//services
import UserService from '../../../services/user'
import useStore from '../../../store/state'

import { Button } from '../../../styledComponents/Button'
import { Input } from '../../../styledComponents/Input'

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
        message: `User ${newFriend} added to friends list`,
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
          <Input
            id="newFriend-input"
            placeholder="Enter Username"
            value={newFriend}
            required
            onChange={(e) => setNewFriend(e.target.value)}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button id="newfriend-btn" onClick={handleNewFriend}>
            Accept
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FriendDialog
