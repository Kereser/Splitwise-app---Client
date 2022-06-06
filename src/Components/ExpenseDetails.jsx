//store
import useStore from '../store/state'

//mui components
import { Divider } from '@mui/material'

//Services to update
import UserService from '../services/user'
import ExpenseService from '../services/expense'

//component
import PartialPayDialog from './PartialPayDialog'
import TransferDialog from './TransferDialog'
import Categorization from '../Components/Categorization'
import { FlexContainer } from '../styledComponents/FlexContainer'

//styled Components
import { Button } from '../styledComponents/Button'

function ExpenseDetails({ user, expense, rate }) {
  const toCurrency = useStore((state) => state.toCurrency)
  const setUser = useStore((state) => state.setUser)
  const debtors = expense.debtors
  const debtor = debtors.filter((u) => u.username === user.username)

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
        <div>
          <FlexContainer justifyContent="space-around">
            <h4>Your total amount to pay is:</h4>
            <h4 style={{ color: '#ff652f' }} data-testid="amount">
              <span>{symbolToShow}</span>
              {amountToPay}
            </h4>
          </FlexContainer>
        </div>
        <Divider style={{ margin: '5px 10px' }} />
        {debtor[0].amount === 0 ? (
          <Categorization expense={expense} user={user} />
        ) : (
          <>
            <FlexContainer>
              <Button onClick={handleTotalPay}>Total pay</Button>
              <PartialPayDialog expense={expense} debtor={debtor} user={user} />
              <TransferDialog expense={expense} user={user} />
            </FlexContainer>
            <Divider style={{ margin: '10px 0' }} />
            <Categorization expense={expense} user={user} />
          </>
        )}
      </>
    )
  } else {
    return (
      <div>
        <Categorization expense={expense} user={user} />
      </div>
    )
  }
}

export default ExpenseDetails
