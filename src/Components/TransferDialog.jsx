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

//store
import useStore from '../store/state'

//service
import UserService from '../services/user'
import { eventSender } from '../socketEvents/eventSender'

function TransferDialog({ expense, user }) {
  const [open, setOpen] = useState(false)
  const [userToTransfer, setUserToTransfer] = useState('')
  const socket = useStore((state) => state.socket)
  const setAlert = useStore((state) => state.setAlert)

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleTransfer = async () => {
    try {
      const totalUsers = await UserService.getAll()
      const totalUsernames = totalUsers.map((u) => u.username)

      if (!totalUsernames.includes(userToTransfer)) {
        setUserToTransfer('')
        setAlert({
          type: 'error',
          message: "Username doesn't exist in database",
          trigger: true,
        })
        return
      }
      const event = 'newNotification'
      const payload = {
        senderUser: { username: user.username, id: user.id },
        recieverUsers: [userToTransfer],
        expense,
        transfer: true,
      }
      eventSender(socket, event, payload)
    } catch (err) {
      console.error(err)
    }
    setOpen(false)
    setUserToTransfer('')
  }

  return (
    <Box component={'span'}>
      <Button
        variant="contained"
        size="small"
        color="warning"
        onClick={handleClickOpen}
        style={{ margin: '2px 7px' }}
      >
        Transfer debt
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Paper>
            <Box className="title-popup-btn">Transfer your debt</Box>
          </Paper>
          <Box
            component={'input'}
            className="input"
            placeholder="Enter Username"
            value={userToTransfer}
            required
            style={{ margin: '20px 0 0' }}
            onChange={(e) => setUserToTransfer(e.target.value)}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleTransfer}>Accept</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TransferDialog
