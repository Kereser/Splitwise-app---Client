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

function TransferDialog() {
  const [open, setOpen] = useState(false)
  const [userToTransfer, setUserToTransfer] = useState('')

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
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
          <Button onClick={handleClose}>Accept</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TransferDialog
