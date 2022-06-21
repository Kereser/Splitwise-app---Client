import React, { useEffect, useState } from 'react'

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
  const setAlert = useStore((state) => state.setAlert)

  useEffect(() => {
    const expensePreference = user.preferences.filter((e) => {
      return e.expense.id === expense.id
    })
    setCurrentCategory(
      expensePreference.length === 0 ? '' : expensePreference[0].category,
    )
  }, [expense, user.preferences])

  const handleChange = (event) => {
    setSelected(event.target.value)
  }

  const handleSetCategory = async () => {
    try {
      const UpdatedUser = await UserService.update(
        { user, action: { type: 'Preferences', expense, selected } },
        user.id,
      )
      setUser(UpdatedUser)
    } catch (err) {
      console.error(err)
      setAlert({
        type: 'error',
        message: err.response.data.message,
        trigger: true,
      })
    }
  }

  const options = ['Important', 'Intermediate', 'Casual']

  return (
    <div>
      <h4>
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
      </h4>
      <Dropdown
        className="category-ddwn"
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
    </div>
  )
}

export default Categorization
