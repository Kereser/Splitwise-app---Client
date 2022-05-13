import { useState, useEffect } from 'react'

//mui components
import { Box, Container, Paper, Grid } from '@mui/material'

// State
import useStore from '../../store/state'

//Components
import NavBar from '../NavBar'
import Dashboard from './Dashboard'
import Friends from './Friends'
import MainOptions from './MainOptions'

//service
import UserService from '../../services/user'

//router
import { Route, useLocation } from 'wouter'

const HomeUser = () => {
  const [notifications, setNotifications] = useState([])
  const [location] = useLocation()

  //store
  const user = useStore((state) => state.user)
  const socket = useStore((state) => state.socket)
  const setUser = useStore((state) => state.setUser)

  // todo:  Si quisiera actualizar, tendria q enviar un evento al backend desde mi front con los nombres de los usuarios a actualizar.
  //! basicamente es lo mismo q con las notificaciones pero con un evento q se llame updateExpense o algo asi. Pero por ahora debo darle prioridad a la parte del front y el poder debitar pagos parciales o totales.
  // ? En el backend, podria enviar la info como a los q reciben el expense y quien lo mando tipo notificacion y asi cuando me llegue ese tipo de evento, actualizar el expense a los usuarios q les llego ese evento.]

  console.log('My user in general: ', user)
  useEffect(() => {
    socket.on('getExpense', (data) => {
      console.log('Actualizando las notificaciones: ', data)
      setNotifications((prev) => [...prev, ...data])

      console.log('My user in getExpense: ', user)
      // Actualizo los expenses del usuario q este online y le llegue la not de la new expense.
      async function updateExpenses() {
        const updatedUser = await UserService.getOneUser(user.id)
        console.log(updatedUser, 'updatedUser')
        setUser(updatedUser)
      }

      updateExpenses()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  //Useeffect para actualizar las Expenses//Friens cuando visiste las pagins en cuestion
  useEffect(() => {
    if (location === '/Dashboard' || location === '/Friends') {
      async function updateExpenses() {
        const updatedUser = await UserService.getOneUser(user.id)
        console.log(updatedUser, 'updatedUser')
        setUser(updatedUser)
      }

      updateExpenses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  //styles
  const paperStyle = {
    width: '100%',
    height: '90vh',
    padding: '0',
    overflowY: 'auto',
  }

  const gridStyle = {
    maxWidth: '850px',
  }

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
            <MainOptions />
          </Grid>
          <Grid item xs={8}>
            <Paper elevation={5} style={paperStyle} align="center">
              <Route path="/Dashboard">
                <Dashboard user={user} />
              </Route>
              <Route path="/Friends">
                <Friends />
              </Route>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            Columna al lado
          </Grid>
        </Grid>
      </Paper>

      {/* routes */}
    </Container>
  )
}

export default HomeUser
