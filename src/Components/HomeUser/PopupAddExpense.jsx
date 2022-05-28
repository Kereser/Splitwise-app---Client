import { useState } from 'react'

//mui components
import { Box, Grid, Button, Paper, Divider, Avatar } from '@mui/material'

//components
import MainExpensivePopup from './MainExpensivePopup'

//Services to update
import UserService from '../../services/user'
import ExpenseService from '../../services/expense'

//Mui icons
import ReceiptIcon from '@mui/icons-material/Receipt'
import SelectButtons from './SelectButtons'

//store
import useStore from '../../store/state'
import { eventSender } from '../../socketEvents/eventSender'

function PopupAddExpense({ newExpense, user, setNewExpense, friend = null }) {
  //State to expensive
  const [toUser, setToUser] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [percentage, setPercentage] = useState(50)

  //store
  const socket = useStore((state) => state.socket)
  const setUser = useStore((state) => state.setUser)
  const setAlert = useStore((state) => state.setAlert)

  const handleNewExpense = async () => {
    const debtor = friend ? friend : toUser

    try {
      const newExpense = await ExpenseService.create({
        debtor,
        description,
        balance,
        paidBy,
        percentage,
        user,
      })

      const updatedUser = await UserService.getOneUser(user.id)
      setUser(updatedUser)

      const event = 'newNotification'
      const payload = {
        expense: newExpense,
        senderUser: { username: user.username, id: user.id },
        recieverUsers: newExpense.debtors.map((d) => d.username),
      }

      eventSender(socket, event, payload)

      setNewExpense(false)
      setBalance(0)
      setDescription('')
      setToUser('')
      setPaidBy('')
      setPercentage(50)
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response.data.message,
        trigger: true,
      })
    }
  }

  return (
    <Box>
      <MainExpensivePopup trigger={newExpense}>
        <Paper>
          <Box className="title-popup-btn">Add an expense</Box>
        </Paper>
        <Box
          style={{
            margin: '10px 5px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box component={'span'}>With you and: </Box>
          {friend ? (
            <Box
              component={'input'}
              className="input"
              defaultValue={friend}
              required
              disabled
            />
          ) : (
            <Box
              component={'input'}
              className="input"
              placeholder="Enter Username"
              value={toUser}
              required
              onChange={(e) => setToUser(e.target.value)}
            />
          )}
        </Box>
        <Divider />
        <Box className="expense-container">
          <Grid
            container
            style={{
              width: '80%',
              alignItems: 'center',
            }}
          >
            <Grid item xs={3}>
              <Avatar>
                <ReceiptIcon />
              </Avatar>
            </Grid>
            <Grid item xs={9}>
              <Box
                component={'input'}
                required
                className="input input-expense"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Box
                component={'input'}
                required
                className="input input-expense amount"
                placeholder="0"
                type={'number'}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box>
            Paid by:{' '}
            <Box
              component={'input'}
              className="input input-expense paid-by"
              placeholder={user.username}
              value={paidBy}
              required
              onChange={(e) => setPaidBy(e.target.value)}
            />
          </Box>
          <Grid
            container
            style={{
              width: '80%',
              alignItems: 'center',
              marginTop: '15px',
            }}
          >
            <Grid item xs={3}>
              Split:
            </Grid>
            <Grid item xs={9}>
              <SelectButtons
                percentage={percentage}
                setPercentage={setPercentage}
              />
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Grid container style={{ justifyContent: 'flex-end' }}>
          <Button onClick={() => setNewExpense(false)}>Close</Button>
          <Button onClick={handleNewExpense}>Save</Button>
        </Grid>
      </MainExpensivePopup>
    </Box>
  )
}

export default PopupAddExpense
