//mui components
import { Grid, Box } from '@mui/material'

function ExpenseSummary({ expense, paidBy, debtors, user }) {
  const months = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre',
  }

  const month = months[parseInt(expense.date.split('T')[0].split('-')[1])]
  const day = expense.date.split('T')[0].split('-')[2]

  return (
    <Grid container className="expenses-grid" style={{ padding: '0 0 0 5px' }}>
      <Box>
        <Grid container>
          <Grid item style={{ margin: '0 5px' }}>
            <Box className="date month">{month}</Box>
            <Box className="date day">{day}</Box>
          </Grid>
          <Grid
            item
            style={{
              margin: '0 5px ',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {expense.description.length > 24
              ? expense.description.slice(0, 24) + '...'
              : expense.description}
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container>
          <Grid item>
            <Box className="paidBy">
              {paidBy.length > 1
                ? paidBy.map((u) => u.username).includes(user.username)
                  ? `You and others paid`
                  : `${paidBy.length} paid`
                : paidBy[0].username === user.username
                ? 'You paid'
                : `${paidBy[0].username} paid`.length > 18
                ? `${paidBy[0].username.slice(0, 18)}...`
                : `${paidBy[0].username} paid`}
            </Box>
            <Box className="amount-right">
              <Box component={'span'} style={{ fontSize: '13px' }}>
                $
              </Box>
              {paidBy.map((u) => u.amount).reduce((acc, el) => acc + el, 0)}
            </Box>
          </Grid>
          <Grid item style={{ margin: '0 0 0 10px' }}>
            <Box className="debtors">
              {debtors.length > 1
                ? `${debtors.length} owes`
                : debtors[0].username === user.username
                ? 'You lent'
                : `${debtors[0].username} owes`}
            </Box>
            {!debtors.some((u) => u.username === user.username) ? (
              <Box className="amount-left" style={{ color: '#5bc5a7' }}>
                <Box component={'span'} style={{ fontSize: '13px' }}>
                  $
                </Box>
                {debtors.map((u) => u.amount).reduce((acc, el) => acc + el, 0)}
              </Box>
            ) : (
              <Box className="amount-left" style={{ color: '#ff652f' }}>
                <Box component={'span'} style={{ fontSize: '13px' }}>
                  $
                </Box>
                {debtors.map((u) => u.amount).reduce((acc, el) => acc + el, 0)}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

export default ExpenseSummary
