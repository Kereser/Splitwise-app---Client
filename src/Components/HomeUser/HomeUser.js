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

const HomeUser = () => {
  const [newExpense, setNewExpense] = useState(false)

  //socket
  const socket = useStore((state) => state.socket)
  const user = useStore((state) => state.user)
  const [toUser, setToUser] = useState('')

  // usersDisconnectd
  const setNotification = useStore((state) => state.setNotifications)
  const notification = useStore((state) => state.notifications)

  //State to expensive
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [paidBy, setPaidBy] = useState('')

  useEffect(() => {
    console.log('Socket se cambio: ', socket)
    socket.on('getExpense', (data) => {
      setNotification([...notification, data])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, notification])

  // TODO: Ahora lo q me toca hacer es mostrar una notificaciion con un boton y asi eliminar mis notificaciones y mandar la aceptacion o rechazo de la nueva cuenta.

  //! Puedo agregar un expensive solo o agregarlo a una cuenta. La opcion de la cuenta se habilita cuando tenga una cuenta.

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

  const handleNewExpense = () => {
    socket.emit('newExpense', {
      senderUser: user.username,
      // ID para acomodar la key en las notificaciones.
      senderUserId: user.id,
      description,
      amount,
      receiverUser: toUser,
    })
    setNewExpense(false)

    // TODO: Crear aqui el newExpense con las cosas q se ingresaron

    //? OJO: Cuando anada el expense, debo agregarlo tambien a cada uno de los usuarios q estan. Sean deudores o pagadores.
    // ! Para la actualizacion del estado en distintos puntos de la app, puedo mirar como lo hice en fullstackopen o tambien mandar un evento para q actualice el estado desde uno al otro.
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
                          className="input input-expense"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <Box
                          component={'input'}
                          className="input input-expense amount"
                          placeholder="0"
                          type={'number'}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    <Box>
                      Paid by:{' '}
                      <Box
                        component={'input'}
                        className="input input-expense paid-by"
                        placeholder="Username"
                        value={paidBy}
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
                        <SelectButtons />
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
