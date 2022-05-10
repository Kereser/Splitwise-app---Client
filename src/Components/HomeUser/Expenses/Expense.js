import React, { useState } from 'react'

//Mui components
import {
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  Paper,
  Typography,
} from '@mui/material'

//Mui Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

//state
import useStore from '../../../store/state'

//components
import MainExpensivePopup from '../MainExpensivePopup'

//service to update expense
import ExpenseService from '../../../services/expense'
import UserService from '../../../services/user'

function Expense({ expense }) {
  const user = useStore((state) => state.user)
  const [trigger, setTrigger] = useState(false)
  const [payment, setPayment] = useState(0)
  const setExpenses = useStore((state) => state.setExpenses)

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

  const paidBy = expense.paidBy
  const debtors = expense.debtors

  const debtor = debtors.filter((u) => u.username === user.username)

  //Mui styles
  const accordionSummaryStyle = {
    borderRadius: '0',
    backgroundColor: '#fff',
    margin: '2px 0',
  }

  const accordingDetailsStyle = {
    backgroundColor: 'rgb(240, 240, 240)',
    padding: '10px 5px',
  }

  const reBtnStyle = {
    margin: '2px 7px',
  }

  //handle events
  const handlePartialTrigger = () => {
    setTrigger(true)
  }

  const handlePartialPayment = async () => {
    const debtorsToUpdate = expense.debtors
    debtorsToUpdate.map((u) => {
      if (u.username === user.username) {
        u.amount -= +payment
        return u
      }
      return u
    })
    expense.debtors = debtorsToUpdate
    const id = expense.id
    try {
      const newExpense = await ExpenseService.update(expense, id)

      console.log(newExpense)
      if (newExpense) {
        const updatedUser = await UserService.getOneUser(user.id)
        console.log(updatedUser, 'updatedUser')
        const expenses = updatedUser.expenses
        setExpenses(expenses)
      }
    } catch (erro) {
      alert('Could not update expense')
      console.log('error: ', erro)
    }
    setTrigger(false)
    setPayment(0)
  }

  return (
    <Accordion style={accordionSummaryStyle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id="expense-summary">
        <Grid container className="expenses-grid">
          <Box>
            <Grid container>
              <Grid item style={{ margin: '0 5px ' }}>
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
                {expense.description}
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container>
              <Grid item style={{ margin: '0 10px 0' }}>
                <Box className="paidBy">
                  {paidBy.length > 1
                    ? paidBy.map((u) => u.username).includes(user.username)
                      ? ` You and others paid`
                      : `${paidBy.length} paid`
                    : paidBy[0].username === user.username
                    ? 'You paid'
                    : `${paidBy[0].username} paid`}
                </Box>
                <Box className="amount">
                  <Box component={'span'}>$</Box>
                  {paidBy.map((u) => u.amount).reduce((acc, el) => acc + el, 0)}
                </Box>
              </Grid>
              <Grid item>
                <Box className="debtors">
                  {debtors.length > 1
                    ? `${debtors.length} owes`
                    : debtors[0].username === user.username
                    ? 'You lent'
                    : `${debtors[0].username} owes you`}
                </Box>
                <Box className="amount">
                  <Box component={'span'}>$</Box>
                  {debtors
                    .map((u) => u.amount)
                    .reduce((acc, el) => acc + el, 0)}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={accordingDetailsStyle}>
        {debtors.map((u) => u.username).includes(user.username) ? (
          <>
            <Box>
              <Grid
                container
                style={{ justifyContent: 'Space-around', alignItems: 'center' }}
              >
                <Grid item style={{ lineHeight: '30px' }}>
                  Your total amount to pay is:
                </Grid>
                <Grid item>
                  <Box component={'span'}>$</Box>
                  {debtor[0].amount}
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
                <Button
                  color="secondary"
                  size="small"
                  style={reBtnStyle}
                  disabled
                  onClick={handlePartialTrigger}
                >
                  Parcial pay
                </Button>{' '}
              </>
            ) : (
              <>
                <Button
                  color="success"
                  variant="contained"
                  size="small"
                  style={reBtnStyle}
                >
                  Total pay
                </Button>
                <Button
                  color="secondary"
                  size="small"
                  style={reBtnStyle}
                  onClick={handlePartialTrigger}
                >
                  Parcial pay
                </Button>
              </>
            )}
            <MainExpensivePopup trigger={trigger}>
              <Paper>
                <Box className="title-popup-btn">Parcial payment</Box>
              </Paper>
              <Box style={{ margin: '15px 7px' }}>
                <Box style={{ margin: '5px 0' }}>
                  Enter the value u want to pay:
                </Box>
                <Box
                  component={'input'}
                  className="input"
                  style={{ fontSize: '1.5rem', width: '58px' }}
                  placeholder={`${debtor[0].amount}`}
                  value={payment}
                  type="number"
                  min={0}
                  max={debtor[0].amount}
                  required
                  onChange={(e) => setPayment(e.target.value)}
                />
              </Box>
              <Divider />
              {payment > debtor[0].amount ? (
                <>
                  <Typography variant="subtitle2">
                    You can't pay more than ${debtor[0].amount}
                  </Typography>
                  <Button
                    size="small"
                    style={reBtnStyle}
                    disabled
                    className="dsb-btn"
                  >
                    Accept
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  style={reBtnStyle}
                  onClick={handlePartialPayment}
                >
                  Accept
                </Button>
              )}
              <Button
                size="small"
                style={reBtnStyle}
                onClick={() => setTrigger(false)}
              >
                Close
              </Button>
            </MainExpensivePopup>
          </>
        ) : (
          <Box>You owe nothing in this expense.</Box>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default Expense
