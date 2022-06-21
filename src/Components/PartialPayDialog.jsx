import {
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
import { FlexContainer } from '../styledComponents/FlexContainer'

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
        setUser(updatedUser)
      }
    } catch (erro) {
      console.error('error: ', erro)
    }
    setPayment(0)
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
              <div className="title-popup-btn">Parcial payment</div>
            </Paper>
            <FlexContainer orientation="column">
              <div style={{ margin: '5px 0' }}>
                Enter the value u want to pay:
              </div>
              <Input
                placeholder={`${debtor[0].amount}`}
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                type="number"
                required
              />
            </FlexContainer>
            <Divider />
          </>
        </DialogContent>
        {payment > debtor[0].amount ? (
          <>
            <h5 style={{ textAlign: 'center' }}>
              You can't pay more than ${debtor[0].amount}
            </h5>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </>
        ) : payment <= 0 ? (
          <>
            <h5 style={{ textAlign: 'center', marginBottom: '15px' }}>
              You must enter a valid value
            </h5>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </>
        ) : (
          <DialogActions>
            <Button onClick={handlePartialPayment}>Accept</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}

export default ParcialPayDialog
