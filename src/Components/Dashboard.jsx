import React, { useState } from 'react'
//mui components
import { Grid, Divider } from '@mui/material'

//Components
import Expenses from './Expenses'
import PopupAddExpense from './PopupAddExpense'
import { Button } from '../styledComponents/Button'

function Dashboard({ user, friend = null, filterByFriend = null }) {
  const [newExpense, setNewExpense] = useState(false)

  // event Handlers
  const handleClick = () => {
    setNewExpense(true)
  }

  return (
    <>
      <Grid
        container
        style={{
          alignItems: 'center',
          backgroundColor: '#EEE',
          justifyContent: 'space-between',
          padding: '2px 20px',
        }}
      >
        <Grid item className="title">
          {friend ? friend : 'All expenses'}
        </Grid>
        <Grid item>
          <Button onClick={handleClick} primary>
            New expense
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Expenses filterByFriend={filterByFriend} />
      <Grid>
        <PopupAddExpense
          newExpense={newExpense}
          user={user}
          friend={friend}
          setNewExpense={setNewExpense}
        />
      </Grid>
    </>
  )
}

export default Dashboard
