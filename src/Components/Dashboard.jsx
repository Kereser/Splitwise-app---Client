//mui components
import { Grid, Divider } from '@mui/material'

//Components
import Expenses from './Expenses'
import NewExpenseDialog from './NewExpenseDialog'

function Dashboard({ user, friend = null, filterByFriend = null }) {
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
          <NewExpenseDialog user={user} friend={friend} />
        </Grid>
      </Grid>
      <Divider />
      <Expenses filterByFriend={filterByFriend} />
    </>
  )
}

export default Dashboard
