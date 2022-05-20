import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Paper,
  Divider,
} from '@mui/material'

import { useState } from 'react'

//services
import UserService from '../../../services/user'
import ExpenseService from '../../../services/expense'

//store
import useStore from '../../../store/state'

function ExpenseDialog({ debtor, expense, user }) {
  const [open, setOpen] = useState(false)
  const [payment, setPayment] = useState(0)
  const setUser = useStore((state) => state.setUser)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handlePartialPayment = async () => {
    setOpen(false)
    const debtorsToUpdate = expense.debtors
    debtorsToUpdate.map((u) => {
      if (u.username === user.username) {
        u.amount -= +payment
        return u
      }
      return u
    })
    expense.debtors = debtorsToUpdate
    const id = expense.id
    try {
      const newExpense = await ExpenseService.update(expense, id)

      console.log(newExpense)
      if (newExpense) {
        const updatedUser = await UserService.getOneUser(user.id)
        console.log(updatedUser, 'updatedUser')
        setUser(updatedUser)
      }
    } catch (erro) {
      console.log('error: ', erro)
    }
    setPayment(0)
  }

  //Styles
  const reBtnStyle = {
    margin: '2px 7px',
  }

  return (
    <Box component={'span'}>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={handleClickOpen}
      >
        Parcial Pay
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <>
            <Paper>
              <Box className="title-popup-btn">Parcial payment</Box>
            </Paper>
            <Box
              style={{
                margin: '15px 7px',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Box style={{ margin: '5px 0' }}>
                Enter the value u want to pay:
              </Box>
              <Box
                component={'input'}
                className="input"
                style={{ fontSize: '1.4rem', width: '100%' }}
                placeholder={`${debtor[0].amount}`}
                value={payment}
                type="number"
                min={0}
                max={debtor[0].amount}
                required
                onChange={(e) => setPayment(e.target.value)}
              />
            </Box>
            <Divider />
          </>
        </DialogContent>
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
