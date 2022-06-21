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
    async function fetchData() {
      if (location === '/Dashboard') {
        setSelected('All')
        try {
          const updatedUser = await UserService.update(
            {
              user,
              action: {
                type: 'filterExpense',
                selected: 'All',
                expensesAtStart,
              },
            },
            user.id,
          )
          setUser(updatedUser)
        } catch (err) {
          setSelected('')
          console.log(err)
        }
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const handleChange = async ({ target }) => {
    setSelected(target.value)
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
