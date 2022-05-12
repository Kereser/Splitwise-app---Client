import React, { useState } from 'react'

//store
import useStore from '../../../store/state'

//mui components
import { Box, Grid, Divider, Button, Paper, Typography } from '@mui/material'

//Services to update
import UserService from '../../../services/user'
import ExpenseService from '../../../services/expense'

//component
import MainExpensivePopup from '../MainExpensivePopup'

function ExpenseDetails({ debtors, user, expense }) {
  const [trigger, setTrigger] = useState(false)
  const [payment, setPayment] = useState(0)

  //store
  const setUser = useStore((state) => state.setUser)

  const debtor = debtors.filter((u) => u.username === user.username)

  const reBtnStyle = {
    margin: '2px 7px',
  }

  //handle events
  const handlePartialTrigger = () => {
    setTrigger(true)
  }

  //! Desde aqui debo enviar un evento con un socket con todos los usuarios para q envie una senal de actualizacion de expenses a los usuarios online! NO SE HACE CON LOS OFFLINE pq a ellos cuando entren a la app ya van a tener actualizado el estado.
  const handlePartialPayment = async () => {
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
    setTrigger(false)
    setPayment(0)
  }

  const handleTotalPay = async () => {
    const confirm = window.confirm(
      `Are you sure you want to pay the total amount of this expense? $${debtor[0].amount}`,
    )
    if (confirm) {
      const debtorsToUpdate = expense.debtors
      debtorsToUpdate.map((u) => {
        if (u.username === user.username) {
          u.amount = 0
          return u
        }
        return u
      })
      expense.debtors = debtorsToUpdate
      const id = expense.id
      try {
        const newExpense = await ExpenseService.update(expense, id)

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
  }

  if (debtors.map((u) => u.username).includes(user.username)) {
    return (
      <>
        <Box>
          <Grid
            container
            style={{ justifyContent: 'Space-around', alignItems: 'center' }}
          >
            <Grid item style={{ lineHeight: '30px' }}>
              Your total amount to pay is:
            </Grid>
            <Grid item>
              <Box component={'span'}>$</Box>
              {debtor[0].amount}
            </Grid>
          </Grid>
        </Box>
        <Divider style={{ margin: '5px 10px' }} />
        {debtor[0].amount === 0 ? (
          <>
            <Button
              color="success"
              variant="contained"
              size="small"
              style={reBtnStyle}
              disabled
            >
              Total pay
            </Button>
            <Button
              color="secondary"
              size="small"
              style={reBtnStyle}
              disabled
              onClick={handlePartialTrigger}
            >
              Parcial pay
            </Button>{' '}
          </>
        ) : (
          <>
            <Button
              color="success"
              variant="contained"
              size="small"
              style={reBtnStyle}
              onClick={handleTotalPay}
            >
              Total pay
            </Button>
            <Button
              color="secondary"
              size="small"
              style={reBtnStyle}
              onClick={handlePartialTrigger}
            >
              Parcial pay
            </Button>
          </>
        )}
        <MainExpensivePopup trigger={trigger}>
          <Paper>
            <Box className="title-popup-btn">Parcial payment</Box>
          </Paper>
          <Box style={{ margin: '15px 7px' }}>
            <Box style={{ margin: '5px 0' }}>
              Enter the value u want to pay:
            </Box>
            <Box
              component={'input'}
              className="input"
              style={{ fontSize: '1.5rem', width: '58px' }}
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
          {payment > debtor[0].amount ? (
            <>
              <Typography variant="subtitle2">
                You can't pay more than ${debtor[0].amount}
              </Typography>
              <Button
                size="small"
                style={reBtnStyle}
                disabled
                className="dsb-btn"
              >
                Accept
              </Button>
            </>
          ) : (
            <Button
              size="small"
              style={reBtnStyle}
              onClick={handlePartialPayment}
            >
              Accept
            </Button>
          )}
          <Button
            size="small"
            style={reBtnStyle}
            onClick={() => setTrigger(false)}
          >
            Close
          </Button>
        </MainExpensivePopup>
      </>
    )
  } else {
    return <Box>You owe nothing in this expense.</Box>
  }
}

export default ExpenseDetails
