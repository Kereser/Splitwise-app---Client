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
  const expensesAtStart = useStore((state) => state.expensesAtStart)
  const setExpensesAtStart = useStore((state) => state.setExpensesAtStart)

  const handleNewExpense = async () => {
    const debtor = friend ? friend : toUser

    if (paidBy.length === 0 || debtor.length === 0) {
      console.log(paidBy, toUser)
      setAlert({
        type: 'warning',
        message: 'You must set debtors and payers',
        trigger: true,
      })
      return
    }

    if (!paidBy.includes(user.username)) {
      setAlert({
        type: 'warning',
        message: 'You must be in payers list.',
        trigger: true,
      })
      return
    }

    if (toUser.includes(user.username)) {
      setAlert({
        type: 'warning',
        message: 'You can not be in debtors list.',
        trigger: true,
      })
      return
    }

    if (balance <= 0) {
      setAlert({
        type: 'error',
        message: 'You can not set a balance of 0',
        trigger: true,
      })
      return
    }

    let formattedPaidBy = paidBy.split(',').map((user) => user.trim())
    const usersToDebtors = toUser === '' ? friend : toUser
    let debtors = usersToDebtors
      .split(',')
      .map((user) => user.trim())
      .filter((user) => !formattedPaidBy.includes(user))

    //logic to send to friend
    let totalUsernames = []
    if (friend) {
      try {
        const totalUsers = await UserService.getAll()
        totalUsernames = totalUsers.map((u) => u.username)

        console.log(totalUsernames, 'Con friend')

        const usernames = [
          friend,
          ...paidBy.split(',').map((user) => user.trim()),
        ]

        console.log(usernames, 'USErs')

        for (let i = 0; i < usernames.length; i++) {
          if (!totalUsernames.includes(usernames[i])) {
            setAlert({
              type: 'error',
              message: `${usernames[i]} doesn't exist in the database`,
              trigger: true,
            })
            return
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    //logic to send by dashboard
    try {
      const totalUsers = await UserService.getAll()
      totalUsernames = totalUsers.map((u) => u.username)
    } catch (err) {
      console.error(err)
    }

    const totalUsers = [...formattedPaidBy, ...debtors]
    console.log(totalUsers, totalUsernames)
    for (let i = 0; i < totalUsers.length; i++) {
      if (!totalUsernames.includes(totalUsers[i])) {
        setAlert({
          type: 'error',
          message: `${totalUsers[i]} doesn't exist in the database`,
          trigger: true,
        })
        return
      }
    }

    if (debtors.length === 0) {
      setAlert({
        type: 'warning',
        message: 'You must set at least one debtor',
        trigger: true,
      })
      return
    }

    const totalDebt = balance * (percentage / 100)
    const totalPayed = balance - totalDebt

    formattedPaidBy.map((paidBy, i, arr) => {
      return (arr[i] = {
        username: paidBy,
        amount: totalPayed / formattedPaidBy.length,
      })
    })

    debtors.map((debtor, i, arr) => {
      return (arr[i] = { username: debtor, amount: totalDebt / debtors.length })
    })

    console.log('debtors: ', debtors, 'formattedPaidBy: ', formattedPaidBy)

    try {
      const newExpense = await ExpenseService.create({
        description,
        balance,
        paidBy: formattedPaidBy,
        debtors,
      })

      setExpensesAtStart([...expensesAtStart, newExpense])

      // todo: cuando me llegue el new expense, me voy a ir a llamar a mi usuario y le saco los expenses y los actualizo con los q me lleguen.
      // todo: aqui ya controle para actualizar mi usuario q esta enviando la notificacion y online.
      if (newExpense) {
        console.log('New expense: ', newExpense)
        const updatedUser = await UserService.getOneUser(user.id)
        setUser(updatedUser)
        console.log(updatedUser, 'updatedUser')

        const reciverUsers = formattedPaidBy
          .concat(debtors)
          .map((u) => u.username)
          .filter((u) => u !== user.username)

        // Envio de new expense
        socket.emit('newNotification', {
          senderUser: { username: user.username, id: user.id },
          recieverUsers: reciverUsers,
          expense: newExpense,
        })
      }
    } catch (err) {
      alert(`could not create new expense.`)
      console.log(err)
    }

    //! Me falta hacer el filtro para no poder enviar un expense a usuarios q no estan registrados.
    setNewExpense(false)
    setBalance(0)
    setDescription('')
    setToUser('')
    setPaidBy('')
    setPercentage(50)
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
