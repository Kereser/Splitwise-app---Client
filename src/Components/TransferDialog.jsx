import { useState } from 'react'

//mui components
import {
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
} from '@mui/material'

//styled components
import { Button } from '../styledComponents/Button'

//store
import useStore from '../store/state'

//service
import UserService from '../services/user'
import { eventSender } from '../socketEvents/eventSender'
import { Input } from '../styledComponents/Input'

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
    setOpen(false)

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
      setUserToTransfer('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Button warning onClick={handleClickOpen}>
        Transfer debt
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Paper>
            <div className="title-popup-btn">Transfer your debt</div>
          </Paper>
          <Input
            style={{ margin: '10px 0 0' }}
            placeholder="Enter Username"
            value={userToTransfer}
            required
            onChange={(e) => setUserToTransfer(e.target.value)}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleTransfer}>Accept</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TransferDialog
