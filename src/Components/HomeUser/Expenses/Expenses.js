//mui Components
import { Box } from '@mui/material'
import React from 'react'
import useStore from '../../../store/state'
import Expense from './Expense'

function Expenses() {
  const expenses = useStore((state) => state.expenses)
  // TODO: Aqui podria traer mas bien al user q esta actualmente logeado y de ahi sacar los expenses q tiene para mostrarlos dependiendo de su rol en el expense.

  if (expenses.length === 0) {
    return (
      <Box>
        <h1>No expenses yet.</h1>
      </Box>
    )
  } else {
    return (
      <Box>
        {expenses.map((expense) => {
          console.log(expense.date.split('T')[0].split('-'))
          console.log(expense)

          return (
            <Box key={expense.id}>
              <Expense expense={expense} />
            </Box>
          )
        })}
      </Box>
    )
  }
}

export default Expenses
