import React, { useEffect, useState } from 'react'

//mui components
import { Box, Typography } from '@mui/material'

//Service
import UserService from '../services/user'

//store
import useStore from '../store/state'
import Dropdown from './Dropdown'

//styledComponents
import { Button } from '../styledComponents/Button'

function Categorization({ user, expense }) {
  const [selected, setSelected] = useState('')
  const [currentCategory, setCurrentCategory] = useState('')
  const setUser = useStore((state) => state.setUser)

  const handleChange = (event) => {
    setSelected(event.target.value)
  }

  const handleSetCategory = async () => {
    const preferences = user.preferences

    let updatedPreferences

    if (preferences.length === 0) {
      updatedPreferences = {
        expense,
        selected,
      }
      user.preferences = [updatedPreferences]
      const udatedUser = await UserService.update(user, user.id)
      setUser(udatedUser)
    } else if (
      preferences.filter((p) => p.expense.id === expense.id).length === 0
    ) {
      updatedPreferences = {
        expense,
        selected,
      }
      user.preferences = [...user.preferences, updatedPreferences]
      const udatedUser = await UserService.update(user, user.id)
      setUser(udatedUser)
    } else {
      const updatedPreferences = preferences.map((p) => {
        if (p.expense.id === expense.id) {
          return {
            expense,
            selected,
          }
        } else {
          return p
        }
      })
      user.preferences = updatedPreferences
      const udatedUser = await UserService.update(user, user.id)
      setUser(udatedUser)
    }
  }

  useEffect(() => {
    const expensePreference = user.preferences.filter((e) => {
      return e.expense.id === expense.id
    })
    setCurrentCategory(
      expensePreference.length === 0 ? '' : expensePreference[0].category,
    )
  }, [expense, user.preferences])

  const options = ['Important', 'Intermediate', 'Casual']

  return (
    <Box>
      <Typography>
        Current category of this expense:{' '}
        {currentCategory === '' ? (
          <span className="category-span-grey">Unavailable</span>
        ) : currentCategory === 'Important' ? (
          <span className="category-span-red">{currentCategory}</span>
        ) : currentCategory === 'Intermediate' ? (
          <span className="category-span-orange">{currentCategory}</span>
        ) : (
          <span className="category-span-green">{currentCategory}</span>
        )}
      </Typography>
      <Dropdown
        options={options}
        title="Category"
        selected={selected}
        handleChange={handleChange}
      />
      {selected !== '' ? (
        <Button onClick={handleSetCategory} primary>
          Set Category
        </Button>
      ) : null}
    </Box>
  )
}

export default Categorization
