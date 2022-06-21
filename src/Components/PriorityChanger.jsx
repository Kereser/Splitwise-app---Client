import { useState, useEffect } from 'react'

import UserService from '../services/user'

//wouter
import { useLocation } from 'wouter'

import Dropdown from './Dropdown'
import useStore from '../store/state'

function PriorityChanger({ user, setUser }) {
  const [select, setSelect] = useState('')
  const expensesAtStart = useStore((state) => state.expensesAtStart)
  const [location, setLocation] = useLocation()

  useEffect(() => {
    if (location === '/Dashboard') {
      setSelect('')
      async function updateExpenses() {
        try {
          const updatedUser = await UserService.getOneUser(user.id)
          setUser(updatedUser)
        } catch (err) {
          setLocation('/')
          console.error(err)
        }
      }
      updateExpenses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const filterExpense = (user, select, expensesAtStart) => {
    const filteredExpenses = user.preferences
      .filter((p) => {
        return p.category === select
      })
      .map((pref) => pref.expense)

    if (select === 'All' || select === '') {
      return { ...user, expenses: expensesAtStart }
    } else if (filteredExpenses.length === 0) {
      const newUser = { ...user, expenses: [] }
      return newUser
    } else {
      return { ...user, expenses: filteredExpenses }
    }
  }

  const handleChange = async ({ target }) => {
    setSelect(target.value)
    const updatedUser = filterExpense(user, target.value, expensesAtStart)
    setUser(updatedUser)
  }

  const options = ['Important', 'Intermediate', 'Casual', 'All']

  return (
    <Dropdown
      id="priority-ddwn-filter"
      options={options}
      title={'Priority'}
      handleChange={handleChange}
      selected={select}
      orientation="column"
    />
  )
}

export default PriorityChanger
