//mui Components
import { Box, Divider, Paper, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'

//components
import Expense from './Expense'
import FilterExpenses from './FilterExpenses'

//service
import RateServices from '../../../services/rate'

//store
import useStore from '../../../store/state'

function Expenses({ filterByFriend = null }) {
  const user = useStore((state) => state.user)
  const toCurrency = useStore((state) => state.toCurrency)
  const [filter, setFilter] = useState('')
  const [rate, setRate] = useState(0)

  const expenses = filterByFriend ? filterByFriend : user.expenses

  let expensesToShow = expenses.filter((expense) => {
    return expense.description.toLowerCase().startsWith(filter.toLowerCase())
  })

  useEffect(() => {
    async function getRate() {
      const rates = await RateServices.getRates('USD')
      setRate(rates.conversion_rates[toCurrency])
    }

    getRate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toCurrency])

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
                <Expense expense={expense} rate={rate} />
              </Box>
            )
          })}
        </Paper>
      </>
    )
  }
}

export default Expenses
