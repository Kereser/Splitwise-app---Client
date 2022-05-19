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
import Categorization from './Categorization'

function ExpenseDetails({ debtors, user, expense, rate }) {
  const [payment, setPayment] = useState(0)
  const [open, setOpen] = useState(false)
  const toCurrency = useStore((state) => state.toCurrency)

  //store
  const setUser = useStore((state) => state.setUser)

  const debtor = debtors.filter((u) => u.username === user.username)
  console.log(debtor, 'DEBtor')

  const reBtnStyle = {
    margin: '2px 7px',
  }

  //handle events

  //! Desde aqui debo enviar un evento con un socket con todos los usuarios para q envie una senal de actualizacion de expenses a los usuarios online! NO SE HACE CON LOS OFFLINE pq a ellos cuando entren a la app ya van a tener actualizado el estado.
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

  //! Crear componente para la adicion de preferencias por cada uno de los usuarios q obvio cada expense pueda tener su propia categoria.
  //? Me toca igualmente aplicar algo de logica y llamadas a servicios para ver si la nota ya esta seteada como algo, si no, pues poner la respuesta por defecto.

  const amountToPay = (debtor[0]?.amount * rate).toFixed(1)

  const symbolToShow = toCurrency === 'EUR' ? '€' : '$'

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
              <Box component={'span'}>{symbolToShow}</Box>
              {amountToPay}
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
              disabled={true}
              open={open}
              setOpen={setOpen}
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
              open={open}
              setOpen={setOpen}
            >
              <ParcialPaymentPopUp
                debtor={debtor}
                payment={payment}
                setPayment={setPayment}
              />
            </ExpenseDialog>
            <TransferDialog expense={expense} user={user} />
            <Divider style={{ margin: '10px 0' }} />
            <Categorization expense={expense} user={user} />
          </>
        )}
      </>
    )
  } else {
    return (
      <Box>
        <Categorization expense={expense} user={user} />
      </Box>
    )
  }
}

export default ExpenseDetails
