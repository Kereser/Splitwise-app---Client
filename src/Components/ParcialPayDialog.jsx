import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Divider,
} from '@mui/material'

import { useState } from 'react'

//styled components
import { Button } from '../styledComponents/Button'

//services
import UserService from '../services/user'
import ExpenseService from '../services/expense'

//store
import useStore from '../store/state'
import { Input } from '../styledComponents/Input'

function ParcialPayDialog({ debtor, expense, user }) {
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
    try {
      const newExpense = await ExpenseService.update(
        { expense, user, type: 'PartialPay', payment },
        expense.id,
      )
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
    <>
      <Button secundary onClick={handleClickOpen}>
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
              <Input
                placeholder={`${debtor[0].amount}`}
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                type="number"
                min={0}
                max={debtor[0].amount}
                required
              />
            </Box>
            <Divider />
          </>
        </DialogContent>
        {payment > debtor[0].amount ? (
          <>
            <h5 style={{ textAlign: 'center' }}>
              You can't pay more than ${debtor[0].amount}
            </h5>
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
    </>
  )
}

export default ParcialPayDialog
