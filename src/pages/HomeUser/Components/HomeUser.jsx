import { useEffect } from 'react'

//components
import AlertComponent from '../../../Components/AlertComponent'

//mui components
import { Box, Container, Paper, Grid } from '@mui/material'

// State
import useStore from '../../../store/state'

//Components
import NavBar from './NavBar'
import Dashboard from './Dashboard'
import Friends from './Friends'
import MainOptions from './MainOptions'
import CurrencyChanger from '../../../Components/CurrencyChanger'
import PriorityChanger from '../../../Components/PriorityChanger'

//service
import UserService from '../../../services/user'

//router
import { Route, useLocation } from 'wouter'

//socketEvents
import { eventReciever } from '../../../socketEvents/eventReciever'

const HomeUser = () => {
  const [location, setLocation] = useLocation()

  //store
  const socket = useStore((state) => state.socket)
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const setAlert = useStore((state) => state.setAlert)
  const setExpensesAtStart = useStore((state) => state.setExpensesAtStart)
  const notifications = user.notifications

  useEffect(() => {
    eventReciever('getNotification', user, socket, setUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  //Useeffect para actualizar las Expenses//Friens cuando visiste las pagins en cuestion
  useEffect(() => {
    if (location === '/Dashboard') {
      async function updateExpenses() {
        try {
          const updatedUser = await UserService.getOneUser(user.id)
          setUser(updatedUser)
        } catch (err) {
          console.error(err)
          setAlert({
            type: 'error',
            message: 'Not user found',
            trigger: true,
          })
          setLocation('/')
        }
      }
      updateExpenses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(() => {
    setAlert({
      type: 'success',
      message: 'successfully logged in',
      trigger: true,
      user,
    })
    setExpensesAtStart(user.expenses)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //! Puedo cargar aqui otro useEffect() para q me reciba le evento de actualizacion de usuario por aceptacion de deuda o q envia una notificacion por rechazo de la misma.

  //styles
  const paperStyle = {
    width: '100%',
    height: '90vh',
    padding: '0',
    overflowY: 'auto',
    borderRadius: '5px',
  }

  const gridStyle = {
    maxWidth: '850px',
  }

  return (
    <Container maxWidth={false}>
      <Box className="flex-container-nav logout-container">
        <NavBar notifications={notifications} setUser={setUser} user={user} />
      </Box>
      <Paper
        align="center"
        style={{ backgroundColor: '#f4f0ff' }}
        elevation={0}
      >
        <Grid container style={gridStyle}>
          <Grid item xs={2.5}>
            <MainOptions />
          </Grid>
          <Grid item xs={7.5}>
            <Paper elevation={5} style={paperStyle} align="center">
              <Route path="/Dashboard">
                <Dashboard user={user} />
              </Route>
              <Route path="/Friends/:friend">
                {({ friend }) => <Friends friend={friend} user={user} />}
              </Route>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <CurrencyChanger />
            <PriorityChanger user={user} setUser={setUser} />
          </Grid>
        </Grid>
      </Paper>
      <AlertComponent />
    </Container>
  )
}

export default HomeUser
