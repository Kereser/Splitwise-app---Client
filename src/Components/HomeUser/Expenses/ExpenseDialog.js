import { useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material'

function ExpenseDialog({
  children,
  handlePartialPayment,
  debtor,
  payment,
  disabled,
  open,
  setOpen,
}) {
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const reBtnStyle = {
    margin: '2px 7px',
  }

  return (
    <Box component={'span'}>
      {disabled ? (
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleClickOpen}
          disabled
        >
          Parcial Pay
        </Button>
      ) : (
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleClickOpen}
        >
          Parcial Pay
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>{children}</DialogContent>
        {payment > debtor[0].amount ? (
          <>
            <Typography
              variant="subtitle2"
              component={'div'}
              style={{ margin: '5px auto', flex: 1 }}
            >
              You can't pay more than ${debtor[0].amount}
            </Typography>
            <DialogActions>
              <Button
                disabled
                style={reBtnStyle}
                onClick={handlePartialPayment}
              >
                Accept
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </>
        ) : (
          <DialogActions>
            <Button style={reBtnStyle} onClick={handlePartialPayment}>
              Accept
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  )
}

export default ExpenseDialog
