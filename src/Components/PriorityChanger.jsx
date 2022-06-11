import React, { useEffect, useState } from 'react'

import UserService from '../services/user'

//wouter
import { useLocation } from 'wouter'
import Dropdown from './Dropdown'
import useStore from '../store/state'

function PriorityChanger({ user, setUser }) {
  const [selected, setSelected] = useState('')
  const expensesAtStart = useStore((state) => state.expensesAtStart)
  const [location] = useLocation()

  useEffect(() => {
    if (location === '/Dashboard') {
      setSelected('')
    }
  }, [location])

  const handleChange = async ({ target }) => {
    try {
      const updatedUser = await UserService.update(
        {
          user,
          action: {
            type: 'filterExpense',
            selected: target.value,
            expensesAtStart,
          },
        },
        user.id,
      )
      console.log(updatedUser)
      setSelected(target.value)
      setUser(updatedUser)
    } catch (err) {
      setSelected('')
      console.log(err)
    }
  }

  const options = ['Important', 'Intermediate', 'Casual', 'All']

  return (
    <Dropdown
      id="priority-ddwn-filter"
      options={options}
      title={'Priority'}
      handleChange={handleChange}
      selected={selected}
      orientation="column"
    />
  )
}

export default PriorityChanger
