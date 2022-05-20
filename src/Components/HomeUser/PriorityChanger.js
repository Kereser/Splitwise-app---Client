import { useEffect, useState } from 'react'

//mui components
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  Select,
} from '@mui/material'

import useStore from '../../store/state'

//wouter
import { useLocation } from 'wouter'

function PriorityChanger({ user, setUser }) {
  const [priority, setPriority] = useState('')
  const expensesAtStart = useStore((state) => state.expensesAtStart)
  const [location] = useLocation()

  useEffect(() => {
    if (location === '/Dashboard') {
      setPriority('')
    }
  }, [location])

  const handleChange = ({ target }) => {
    setPriority(target.value)
    const expensesInPreferences = user.preferences.filter(
      (p) => p.category === target.value,
    )

    if (target.value === 'All') {
      setUser({ ...user, expenses: expensesAtStart })
    } else if (expensesInPreferences.length === 0) {
      const newExpenses = []
      setUser({ ...user, expenses: newExpenses })
    } else {
      const newExpenses = expensesAtStart.filter((expense) => {
        const idExpensesPreferences = expensesInPreferences.map(
          (p) => p.expense.id,
        )
        return idExpensesPreferences.includes(expense.id)
      })
      setUser({ ...user, expenses: newExpenses })
    }
  }

  const boxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }

  return (
    <Box style={boxStyle}>
      <Typography component={'span'}>Filter by Category: </Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel color="secondary">Filter</InputLabel>
        <Select
          value={priority}
          label="Currency"
          onChange={handleChange}
          size="small"
          color="secondary"
        >
          <MenuItem value="">
            <em>Filter</em>
          </MenuItem>
          <MenuItem value={'Important'}>Important</MenuItem>
          <MenuItem value={'Intermediate'}>Intermediate</MenuItem>
          <MenuItem value={'Casual'}>Casual</MenuItem>
          <MenuItem value={'All'}>All</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default PriorityChanger
