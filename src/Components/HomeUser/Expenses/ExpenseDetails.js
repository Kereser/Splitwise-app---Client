import React, { useState } from 'react'

//store
import useStore from '../../../store/state'

//mui components
import { Box, Grid, Divider, Button } from '@mui/material'

//Services to update
import UserService from '../../../services/user'
import ExpenseService from '../../../services/expense'

//component
import ParcialPaymentPopUp from './ParcialPaymentPopUp'
import ExpenseDialog from './ExpenseDialog'
import TransferDialog from './TransferDialog'

function ExpenseDetails({ debtors, user, expense }) {
  const [payment, setPayment] = useState(0)

  //store
  const setUser = useStore((state) => state.setUser)

  const debtor = debtors.filter((u) => u.username === user.username)

  const reBtnStyle = {
    margin: '2px 7px',
  }

  //handle events

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
            <Grid item style={{ color: '#ff652f' }}>
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
            <ExpenseDialog
              handlePartialPayment={handlePartialPayment}
              debtor={debtor}
              payment={payment}
              setPayment={setPayment}
            >
              <ParcialPaymentPopUp
                debtor={debtor}
                payment={payment}
                setPayment={setPayment}
              />
            </ExpenseDialog>
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
            <ExpenseDialog
              handlePartialPayment={handlePartialPayment}
              debtor={debtor}
              payment={payment}
            >
              <ParcialPaymentPopUp
                debtor={debtor}
                payment={payment}
                setPayment={setPayment}
              />
            </ExpenseDialog>
            <TransferDialog />
          </>
        )}
      </>
    )
  } else {
    return <Box>You owe nothing in this expense.</Box>
  }
}

export default ExpenseDetails
