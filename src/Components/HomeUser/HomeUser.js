import { useState, useEffect } from 'react'

//mui components
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
} from '@mui/material'

// State
import useStore from '../../store/state'

//Components
import NavBar from '../NavBar'
import MainExpensivePopup from './MainExpensivePopup'

//Mui icons
import ReceiptIcon from '@mui/icons-material/Receipt'
import SelectButtons from './SelectButtons'

//service
import ExpenseService from '../../services/expense'
import Expenses from './Expenses'

const HomeUser = () => {
  const [newExpense, setNewExpense] = useState(false)

  //socket
  const socket = useStore((state) => state.socket)
  const user = useStore((state) => state.user)

  // usersDisconnectd
  const setNotification = useStore((state) => state.setNotifications)
  const notification = useStore((state) => state.notifications)

  //State to expensive
  const [toUser, setToUser] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [percentage, setPercentage] = useState(50)

  //expensesState
  const setExpenses = useStore((state) => state.setExpenses)

  useEffect(() => {
    console.log('Socket se cambio: ', socket)
    socket.on('getExpense', (data) => {
      console.log('recibiendo bien la data:', data)
      setNotification([...notification, data])
    })
    console.log('notificaciones: ', notification)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, notification])

  useEffect(() => {
    socket.on('updatedExpenses', (data) => {
      setExpenses((prev) => [...prev, data])
    })
  }, [setExpenses, socket]) //! Probar si con el setExpense no caigo en un loop infinito o se me actualiza en momentos q no quiera.

  useEffect(() => {
    async function getExpenses() {
      try {
        const expenses = await ExpenseService.getAll()
        setExpenses(expenses)
        console.log(expenses)
      } catch (error) {
        console.log(error)
      }
    }

    getExpenses()
  }, [setExpenses])

  // Styes
  const paperStyle = {
    width: '100%',
    height: '90vh',
    padding: '0',
  }

  const gridStyle = {
    maxWidth: '750px',
  }

  // event Handlers

  const handleClick = () => {
    setNewExpense(true)
  }

  const handleNewExpense = async () => {
    //! Puedo agregar un expensive solo o agregarlo a una cuenta. La opcion de la cuenta se habilita cuando tenga una cuenta.
    // TODO: Crear aqui el newExpense con las cosas q se ingresaron
    let formattedPaidBy = paidBy.split(',').map((user) => user.trim())
    let debtors = toUser
      .split(',')
      .map((user) => user.trim())
      .filter((user) => !formattedPaidBy.includes(user))

    if (debtors.length === 0) {
      alert('U must set the debtors')
      return
    }

    const reciverUsers = formattedPaidBy
      .concat(debtors)
      .filter((u) => u !== user.username)

    socket.emit('newExpense', {
      senderUser: user.username,
      // ID para acomodar la key en las notificaciones.
      senderUserId: user.id,
      recieverUsers: reciverUsers,
    })
    setNewExpense(false)

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
      console.log(newExpense)
    } catch (err) {
      alert(`could not create new expense.`)
      console.log(err)
    }
    //? OJO: Cuando anada el expense, debo agregarlo tambien a cada uno de los usuarios q estan. Sean deudores o pagadores.
    // ! Para la actualizacion del estado en distintos puntos de la app, puedo mirar como lo hice en fullstackopen o tambien mandar un evento para q actualice el estado desde uno al otro.
    setBalance(0)
    setDescription('')
    setToUser('')
    setPaidBy('')
    setPercentage(50)
  }

  // Crear un evento cuando se haga click. Se va e enviar el usuario q hizo click y tambien el usuario al q se le envia va a tomarse de un useState q va a ingresar el primer ususario q quiere crear una cuenta con esa persona

  // Podria tener una array con los usernames q hay y si no esta, no dejar crear o enviar la solicitud de crear nueva cuenta

  return (
    <Container maxWidth={false}>
      <Box className="flex-container-nav logout-container">
        <NavBar />
      </Box>
      <Paper
        align="center"
        style={{ backgroundColor: '#f4f0ff' }}
        elevation={0}
      >
        <Grid container style={gridStyle}>
          <Grid item xs={2}>
            Columna al lado
          </Grid>
          <Grid item xs={8}>
            <Paper elevation={5} style={paperStyle} align="center">
              <Grid
                container
                style={{ alignItems: 'center', backgroundColor: '#EEE' }}
              >
                <Grid item xs={7}>
                  All expenses
                </Grid>
                <Grid item xs={5}>
                  <Button onClick={handleClick}>New expense</Button>
                </Grid>
              </Grid>
              <Divider />
              <Expenses />
              <Grid>
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
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            Columna al lado
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default HomeUser
