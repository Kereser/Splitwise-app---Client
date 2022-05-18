//mui Components
import { Box, Divider, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import useStore from '../../../store/state'
import Expense from './Expense'
import FilterExpenses from './FilterExpenses'

function Expenses({ filterByFriend = null }) {
  const user = useStore((state) => state.user)
  const [filter, setFilter] = useState('')

  console.log(user, 'User en expenses')

  const expenses = filterByFriend ? filterByFriend : user.expenses

  console.log(expenses, 'Expenses en expenses')

  let expensesToShow = expenses.filter((expense) => {
    console.log(expense.description.includes(filter))
    return expense.description.toLowerCase().startsWith(filter.toLowerCase())
  })

  if (expenses.length === 0) {
    return (
      <Box>
        <Typography variant="h4" style={{ margin: '50px 0' }}>
          Add an expense to see it here!
        </Typography>
      </Box>
    )
  } else {
    return (
      <>
        <FilterExpenses filter={filter} setFilter={setFilter} />
        <Divider />
        <Paper style={{ margin: '0 10px' }}>
          {expensesToShow?.map((expense) => {
            return (
              <Box key={expense.id}>
                <Expense expense={expense} />
              </Box>
            )
          })}
        </Paper>
      </>
    )
  }
}

export default Expenses
