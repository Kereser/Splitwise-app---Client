//store
import useStore from '../../../store/state'

//mui components
import { Box, Grid, Divider, Button } from '@mui/material'

//Services to update
import UserService from '../../../services/user'
import ExpenseService from '../../../services/expense'

//component
import ParcialPayDialog from '../../../Components/ParcialPayDialog'
import TransferDialog from '../../../Components/TransferDialog'
import Categorization from '../../../Components/Categorization'

function ExpenseDetails({ user, expense, rate }) {
  const toCurrency = useStore((state) => state.toCurrency)
  const setUser = useStore((state) => state.setUser)
  const debtors = expense.debtors
  const debtor = debtors.filter((u) => u.username === user.username)

  //styles
  const reBtnStyle = {
    margin: '2px 7px',
  }

  //handle event
  const handleTotalPay = async () => {
    const confirm = window.confirm(
      `Are you sure you want to pay the total amount of this expense? $${debtor[0].amount}`,
    )
    if (confirm) {
      try {
        const newExpense = await ExpenseService.update(
          { expense, user, type: 'TotalPay' },
          expense.id,
        )

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
            <ParcialPayDialog expense={expense} debtor={debtor} user={user} />
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
