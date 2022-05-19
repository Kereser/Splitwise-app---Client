import React, { useEffect, useState } from 'react'

//mui components
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Button,
} from '@mui/material'

//Service
import UserService from '../../../services/user'

//store
import useStore from '../../../store/state'

function Categorization({ user, expense }) {
  const [category, setCategory] = useState('')
  const [currentCategory, setCurrentCategory] = useState('')
  const setUser = useStore((state) => state.setUser)

  const handleChange = (event) => {
    setCategory(event.target.value)
  }

  console.log(user.preferences)

  const handleSetCategory = async () => {
    const preferences = user.preferences

    let updatedPreferences

    if (preferences.length === 0) {
      updatedPreferences = {
        expense,
        category,
      }
      user.preferences = [updatedPreferences]
      console.log(user.preferences, 'User preferences')
      const udatedUser = await UserService.update(user, user.id)
      setUser(udatedUser)
    } else if (
      preferences.filter((p) => p.expense.id === expense.id).length === 0
    ) {
      updatedPreferences = {
        expense,
        category,
      }
      console.log('segundo if', updatedPreferences)
      user.preferences = [...user.preferences, updatedPreferences]
      const udatedUser = await UserService.update(user, user.id)
      setUser(udatedUser)
    } else {
      const updatedPreferences = preferences.map((p) => {
        if (p.expense.id === expense.id) {
          return {
            expense,
            category,
          }
        } else {
          return p
        }
      })
      user.preferences = updatedPreferences
      const udatedUser = await UserService.update(user, user.id)
      setUser(udatedUser)
      console.log('Else: ', updatedPreferences)
    }
  }

  //style
  const boxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  useEffect(() => {
    const expensePreference = user.preferences.filter((e) => {
      return e.expense.id === expense.id
    })
    console.log(expensePreference, 'expensePreference')
    setCurrentCategory(
      expensePreference.length === 0 ? '' : expensePreference[0].category,
    )
  }, [expense, user.preferences])

  console.log(currentCategory, 'currentCategory')

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
      <Box style={boxStyle}>
        <Typography component={'span'}>Set a category for expense: </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel color="secondary">Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={handleChange}
            size="small"
            color="secondary"
          >
            <MenuItem value="">
              <em>Category</em>
            </MenuItem>
            <MenuItem value={'Important'}>Important</MenuItem>
            <MenuItem value={'Intermediate'}>Intermediate</MenuItem>
            <MenuItem value={'Casual'}>Casual</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {category === '' ? (
        <Button onClick={handleSetCategory} disabled size="small">
          Set Category
        </Button>
      ) : (
        <Button onClick={handleSetCategory} size="small">
          Set Category
        </Button>
      )}
    </Box>
  )
}

export default Categorization
