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
import Expenses from './Expenses/Expenses'

//Mui icons
import ReceiptIcon from '@mui/icons-material/Receipt'
import SelectButtons from './SelectButtons'

//service
import ExpenseService from '../../services/expense'
import UserService from '../../services/user'

const HomeUser = () => {
  const [newExpense, setNewExpense] = useState(false)
  const [notifications, setNotifications] = useState([])

  //socket
  const socket = useStore((state) => state.socket)
  const user = useStore((state) => state.user)

  //State to expensive
  const [toUser, setToUser] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [percentage, setPercentage] = useState(50)

  // expensives
  const setExpenses = useStore((state) => state.setExpenses)

  // todo:  Si quisiera actualizar, tendria q enviar un evento al backend desde mi front con los nombres de los usuarios a actualizar.
  //! basicamente es lo mismo q con las notificaciones pero con un evento q se llame updateExpense o algo asi. Pero por ahora debo darle prioridad a la parte del front y el poder debitar pagos parciales o totales.
  // ? En el backend, podria enviar la info como a los q reciben el expense y quien lo mando tipo notificacion y asi cuando me llegue ese tipo de evento, actualizar el expense a los usuarios q les llego ese evento.]

  console.log('My user in general: ', user)
  useEffect(() => {
    //! Revisar pq las notificaciones quedan como en memoria y no se eliminan como del todo. (Problema de rendimiento.)
    //todo: Probar con el estadio (prev) => {} a ver q pasa con mi estado.
    socket.on('getExpense', (data) => {
      console.log('Actualizando las notificaciones: ', data)
      setNotifications((prev) => [...prev, ...data])
      //todo: cuando llegue la notificacion, conseguir el usuario q ya tendra el expense y simplemente actualizar el estado del expense.

      console.log('My user in getExpense: ', user)
      async function updateExpenses() {
        const updatedUser = await UserService.getOneUser(user.id)
        console.log(updatedUser, 'updatedUser')
        const expenses = updatedUser.expenses
        setExpenses(expenses)
      }

      updateExpenses()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  // Styes
  const paperStyle = {
    width: '100%',
    height: '90vh',
    padding: '0',
    overflowY: 'scroll',
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

      //! Cuando le llegue la notificacion busco al usuario especifico y seteo el state de las notificaciones a ese usuario.
      //! El problema real es como actualizar el estado de los usuarios online a los q se les envia el expense.

      // todo: cuando me llegue el new expense, me voy a ir a llamar a mi usuario y le saco los expenses y los actualizo con los q me lleguen.
      // todo: aqui ya controle para actualizar mi usuario q esta enviando la notificacion y online.
      if (newExpense) {
        const updatedUser = await UserService.getOneUser(user.id)
        console.log(updatedUser, 'updatedUser')
        const expenses = updatedUser.expenses
        setExpenses(expenses)
      }

      //! Agregar el expense al user q tengo.
      // todo: Traer todos los usuarios en el expense y asi poder modificarlos para q tengan su notificacion.
      //? Es mejor hacer toodo en el backend. Puedo enviar los nombres, en el backend los busco, agrego el expense a su lista de expenses y solo faltaria ver como actualizar a cada uno de usos ususarios para q se vea su nueva notificacion.
      // todo: desde el backend puedo mandar un evento q se reciba en el componente expense q de hecho me puede traer el mismo usuario desde el evento.
      //! NO DEBERIA PASAR NADA PQ VOY A TRAER EL USER, PERO NO LO CAMBIARIA POR EL ACUTAL. SOLO CAMBIARIA SUS EXPENSES.
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
        <NavBar
          notifications={notifications}
          setNotifications={setNotifications}
        />
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
                  <Button onClick={handleClick} size="small">
                    New expense
                  </Button>
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
