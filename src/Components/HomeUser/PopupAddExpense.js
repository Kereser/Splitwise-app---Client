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

function PopupAddExpense({ newExpense, user, setNewExpense }) {
  //State to expensive
  const [toUser, setToUser] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [percentage, setPercentage] = useState(50)

  //store
  const socket = useStore((state) => state.socket)
  const setUser = useStore((state) => state.setUser)

  const handleNewExpense = async () => {
    let formattedPaidBy = paidBy.split(',').map((user) => user.trim())
    let debtors = toUser
      .split(',')
      .map((user) => user.trim())
      .filter((user) => !formattedPaidBy.includes(user))

    if (debtors.length === 0) {
      alert('U must set the debtors')
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

      // todo: cuando me llegue el new expense, me voy a ir a llamar a mi usuario y le saco los expenses y los actualizo con los q me lleguen.
      // todo: aqui ya controle para actualizar mi usuario q esta enviando la notificacion y online.
      if (newExpense) {
        const updatedUser = await UserService.getOneUser(user.id)
        console.log(updatedUser, 'updatedUser')
        setUser(updatedUser)
      }
    } catch (err) {
      alert(`could not create new expense.`)
      console.log(err)
    }

    //? Se hace toda la operacion del newexpense aqui porq necesito primero crear el expense antes de enviar el evento de que hay uno nuevo.
    const reciverUsers = formattedPaidBy
      .concat(debtors)
      .map((u) => u.username)
      .filter((u) => u !== user.username)

    // Envio de new expense
    socket.emit('newExpense', {
      senderUser: user.username,
      // ID para acomodar la key en las notificaciones.
      senderUserId: user.id,
      recieverUsers: reciverUsers,
    })
    setNewExpense(false)
    //! Me falta hacer el filtro para no poder enviar un expense a usuarios q no estan registrados.
    // ! Para la actualizacion del estado en distintos puntos de la app, puedo mirar como lo hice en fullstackopen o tambien mandar un evento para q actualice el estado desde uno al otro.
    setBalance(0)
    setDescription('')
    setToUser('')
    setPaidBy('')
    setPercentage(50)
  }

  return (
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
        <Box
          component={'input'}
          className="input"
          placeholder="Enter username"
          value={toUser}
          required
          onChange={(e) => setToUser(e.target.value)}
        />
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
  )
}

export default PopupAddExpense
