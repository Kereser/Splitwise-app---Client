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
import UserService from '../../services/user'
import useStore from '../../store/state'

function FriendDialog({ open, setOpen, user }) {
  const [newFriend, setNewFriend] = useState('')
  const setAlert = useStore((state) => state.setAlert)
  const setUser = useStore((state) => state.setUser)

  const handleClose = () => {
    setOpen(false)
  }

  const handleNewFriend = async () => {
    setNewFriend('')
    setOpen(false)
    try {
      const totalUsers = await UserService.getAll()
      const totalUsernames = totalUsers.map((u) => u.username)

      if (!totalUsernames.includes(newFriend)) {
        setAlert({
          type: 'error',
          message: "Username doesn't exist in database",
          trigger: true,
        })
        return
      }

      const friendToAdd = totalUsers.find((u) => u.username === newFriend)
      const alreadyAddedFriend = user.friends.filter(
        (f) => f.username === friendToAdd.username,
      )
      if (alreadyAddedFriend.length === 1) {
        setAlert({
          type: 'error',
          message: 'You already add this user to friends list',
          trigger: true,
        })
        return
      } else {
        user.friends = user.friends.map((f) => f.id)
        user.friends = user.friends.concat(friendToAdd.id)

        console.log(user)
        const updatedUser = await UserService.update(user, user.id)
        setUser(updatedUser)
        setAlert({
          type: 'success',
          message: `User ${friendToAdd.username} added to friends list`,
          trigger: true,
        })
      }
    } catch (err) {
      console.error(err)
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
