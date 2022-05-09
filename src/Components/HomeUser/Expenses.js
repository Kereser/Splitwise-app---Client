//mui Components
import { Box } from '@mui/material'
import useStore from '../../store/state'

function Expenses() {
  const expenses = useStore((state) => state.expenses)
  // TODO: Aqui podria traer mas bien al user q esta actualmente logeado y de ahi sacar los expenses q tiene para mostrarlos dependiendo de su rol en el expense.

  if (expenses.length === 0) {
    return (
      <Box>
        <h1>No expenses yet.</h1>
      </Box>
    )
  } else {
    return (
      <Box>
        {expenses.map((expense) => (
          <Box key={expense.id}>{expense.description}</Box>
        ))}
      </Box>
    )
  }
}

export default Expenses
