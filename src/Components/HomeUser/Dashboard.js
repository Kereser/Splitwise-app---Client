import React, { useState } from 'react'
//mui components
import { Grid, Button, Divider } from '@mui/material'

//Components
import Expenses from './Expenses/Expenses'
import PopupAddExpense from './PopupAddExpense'

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
          height: '50px',
          justifyContent: 'space-between',
          padding: '2px 20px',
        }}
      >
        <Grid item className="title">
          {friend ? friend : 'All expenses'}
        </Grid>
        <Grid item>
          <Button onClick={handleClick} size="small">
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
