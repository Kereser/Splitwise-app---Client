import React, { useEffect, useState } from 'react'

import useStore from '../store/state'

//wouter
import { useLocation } from 'wouter'
import Dropdown from './Dropdown'

function PriorityChanger({ user, setUser }) {
  const [selected, setSelected] = useState('')
  const expensesAtStart = useStore((state) => state.expensesAtStart)
  const [location] = useLocation()

  useEffect(() => {
    if (location === '/Dashboard') {
      setSelected('')
    }
  }, [location])

  const handleChange = ({ target }) => {
    setSelected(target.value)
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

  const options = ['Important', 'Intermediate', 'Casual', 'All']

  return (
    <Dropdown
      options={options}
      title={'Priority'}
      handleChange={handleChange}
      selected={selected}
      orientation="column"
    />
  )
}

export default PriorityChanger
