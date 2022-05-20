//store
import useStore from '../../../store/state'

//mui components
import { Box, Grid, Divider, Button } from '@mui/material'

//Services to update
import UserService from '../../../services/user'
import ExpenseService from '../../../services/expense'

//component
import ParcialPayDialog from './ParcialPayDialog'
import TransferDialog from './TransferDialog'
import Categorization from './Categorization'

function ExpenseDetails({ debtors, user, expense, rate }) {
  const toCurrency = useStore((state) => state.toCurrency)

  //store
  const setUser = useStore((state) => state.setUser)

  const debtor = debtors.filter((u) => u.username === user.username)
  console.log(debtor, 'DEBtor')

  const reBtnStyle = {
    margin: '2px 7px',
  }

  //handle event
  const handleTotalPay = async () => {
    const confirm = window.confirm(
      `Are you sure you want to pay the total amount of this expense? $${debtor[0].amount}`,
    )
    if (confirm) {
      const debtorsToUpdate = expense.debtors
      debtorsToUpdate.map((u) => {
        if (u.username === user.username) {
          u.amount = 0
          return u
        }
        return u
      })
      expense.debtors = debtorsToUpdate
      const id = expense.id
      try {
        const newExpense = await ExpenseService.update(expense, id)

        if (newExpense) {
          const updatedUser = await UserService.getOneUser(user.id)
          setUser(updatedUser)
        }
      } catch (erro) {
        console.log('error: ', erro)
      }
    }
  }

  const amountToPay = (debtor[0]?.amount * rate).toFixed(1)
  const symbolToShow = toCurrency === 'EUR' ? '€' : '$'

  if (debtors.map((u) => u.username).includes(user.username)) {
    return (
      <>
        <Box>
          <Grid
            container
            style={{ justifyContent: 'Space-around', alignItems: 'center' }}
          >
            <Grid item style={{ lineHeight: '30px' }}>
              Your total amount to pay is:
            </Grid>
            <Grid item style={{ color: '#ff652f' }}>
              <Box component={'span'}>{symbolToShow}</Box>
              {amountToPay}
            </Grid>
          </Grid>
        </Box>
        <Divider style={{ margin: '5px 10px' }} />
        {debtor[0].amount === 0 ? (
          <>
            <Button
              color="success"
              variant="contained"
              size="small"
              style={reBtnStyle}
              disabled
            >
              Total pay
            </Button>
            <Categorization expense={expense} user={user} />
          </>
        ) : (
          <>
            <Button
              color="success"
              variant="contained"
              size="small"
              style={reBtnStyle}
              onClick={handleTotalPay}
            >
              Total pay
            </Button>
            <ParcialPayDialog expense={expense} debtor={debtor} />
            <TransferDialog expense={expense} user={user} />
            <Divider style={{ margin: '10px 0' }} />
            <Categorization expense={expense} user={user} />
          </>
        )}
      </>
    )
  } else {
    return (
      <Box>
        <Categorization expense={expense} user={user} />
      </Box>
    )
  }
}

export default ExpenseDetails
