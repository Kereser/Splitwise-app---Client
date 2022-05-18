import React from 'react'

//mui components
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material'

//icons
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Logout from '@mui/icons-material/Logout'
import { Button, Paper } from '@mui/material'

//services
import UserService from '../services/user'
import ExpenseService from '../services/expense'

//store
import useStore from '../store/state'

//wouter
import { useLocation } from 'wouter'

export default function NavBar({ notifications, user, setUser }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [, setLocation] = useLocation()
  const socket = useStore((state) => state.socket)
  const open = Boolean(anchorEl)

  console.log(notifications)
  //? styles
  const avatarStyle = {
    backgroundColor: '#66b165',
  }

  const btnStyle = {
    margin: '0 8px 5px 8px',
  }

  //Event handlers
  const handleLogOut = () => {
    setLocation('/login')
    setUser({})
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAcceptAll = async () => {
    const confirm = window.confirm(
      'You are about to accept all notifications, including those who ask u for transfer a debt \n\n Are you sure?',
    )
    if (confirm) {
      const newUser = { ...user, notifications: [] }

      try {
        const updatedUser = await UserService.update(newUser, user.id)

        if (updatedUser) {
          console.log(updatedUser, 'updatedUser')
          setUser(updatedUser)
        }
      } catch (err) {
        alert('Could not accept all notification sucessfully')
        console.error(err)
      }
    }
  }

  const handleAccept = async (notif, index) => {
    const originalNotis = user.notifications
    console.log(user)
    console.log('expense: ', notif)
    const newNotis = originalNotis.filter((_n, i) => {
      return i !== index
    })
    const newUser = { ...user, notifications: newNotis }

    try {
      const updatedUser = await UserService.update(newUser, user.id)

      if (updatedUser) {
        console.log(updatedUser, 'updatedUser')
        setUser(updatedUser)
      }
    } catch (err) {
      alert('Could not accept/delete notification sucessfully')
      console.error(err)
    }
    //Este new user es el q debo enviar para actualizar en la base de datos y luego q me retorne le actualizado, setearlo.
  }

  const handleDecline = async (n, index) => {
    socket.emit('newNotification', {
      senderUser: { username: user.username, id: user.id },
      recieverUsers: [n.senderUser.username],
      expense: n.expense,
      acceptTransfer: false,
    })

    const originalNotis = user.notifications
    const newNotis = originalNotis.filter((_n, i) => {
      return i !== index
    })
    const newUser = { ...user, notifications: newNotis }

    try {
      const updatedUser = await UserService.update(newUser, user.id)

      if (updatedUser) {
        console.log(updatedUser, 'updatedUser')
        setUser(updatedUser)
      }
    } catch (err) {
      alert('Could not accept/delete notification sucessfully')
      console.error(err)
    }
  }

  const handleTransferAccept = async (n) => {
    const expenseId = n.expense.id
    // Yo paso la deuda a una persona q originalmente la pago
    //! 1Escenario --> Paso la deuda a una persona q pago y puede haber mas gente endeudada conmigo.
    //! 2Escenario --> Paso la deuda a una persona q tambien debe y q obvio no pago.
    //! 3Escenario --> Paso la deuda a una persona q no esta en la deuda ni en pagadores. (Creo q no afecta q hayan mas personas.) --- Agregar a la nueva persona y quitarla a la q la tenia originlamente.

    if (n.expense.paidBy.some((p) => p.username === user.username)) {
      console.log('Entro al paidBy')
      //! Logica cuando paso a alguien q pago la deuda.
      const expenseToUpdate = n.expense

      const updatedDebtors = expenseToUpdate.debtors.map((d) =>
        d.username === n.senderUser.username
          ? { username: n.senderUser.username, amount: 0 }
          : d,
      )
      expenseToUpdate.debtors = updatedDebtors

      try {
        await ExpenseService.update(expenseToUpdate, expenseId)

        //!Usar el usuario actualizado para setear estado
        user.notifications = user.notifications.filter(
          (not) => not.expense.id !== expenseId,
        )
        const updatedUser = await UserService.update(user, user.id)
        setUser(updatedUser)
      } catch (err) {
        alert('Could not accept/delete notification sucessfully')
        console.error(err)
      }
    }

    //! TENGO Q ACTUALIZAR EL USUSARIO Y LA NOTA PERO CON TODOS LOS CAMPOS.

    // Logica para cuando paso el gasto a una persona que no pago la expense.
    // Y tambien reviso de una vez si al q lo paso esta en los debtors
    else if (n.expense.debtors.some((p) => p.username === user.username)) {
      console.log('Entro al debtors')
      //! Logica cuando paso a alguien q debe.
      const amountToTrasnfer = n.expense.debtors.find(
        (d) => d.username === n.senderUser.username,
      ).amount
      const originalAmount = n.expense.debtors.find(
        (d) => d.username === user.username,
      ).amount
      const newAmount = originalAmount + amountToTrasnfer

      const expenseToUpdate = n.expense
      const updatedDebtors = expenseToUpdate.debtors.map((d) =>
        d.username === n.senderUser.username
          ? { username: n.senderUser.username, amount: 0 }
          : d.username === user.username
          ? { username: user.username, amount: newAmount }
          : d,
      )

      expenseToUpdate.debtors = updatedDebtors

      try {
        await ExpenseService.update(expenseToUpdate, expenseId)

        user.notifications = user.notifications.filter(
          (not) => not.expense.id !== expenseId,
        )
        const updatedUser = await UserService.update(user, user.id)
        setUser(updatedUser)
      } catch (err) {
        alert('Could not accept/delete notification sucessfully')
        console.error(err)
      }
    } else {
      //! Logica cuando no esta dentro de la gente que pago ni debe.
      // Aqui lo q debo hacer es eliminar la nota del senderUser trayendolo y actualizandolo y metiendo ese expense en el expense de los otros.
      // Antes tengo que actualilzar el expense.
      console.log('Entro al else')
      const expenseToUpdate = n.expense
      const updatedDebtors = expenseToUpdate.debtors.map((d) =>
        d.username === n.senderUser.username
          ? { ...d, username: user.username }
          : d,
      )

      expenseToUpdate.debtors = updatedDebtors

      try {
        const transferUser = await UserService.getOneUser(n.senderUser.id)
        console.log('transferUser before update', transferUser)
        transferUser.expenses = transferUser.expenses.filter((e) => {
          console.log('Transfer User: ', transferUser)
          console.log(e.id, expenseId)
          return e.id !== expenseId
        })
        console.log('transferUser after update', transferUser)
        await UserService.update(transferUser, n.senderUser.id)

        const updatedExpense = await ExpenseService.update(
          expenseToUpdate,
          expenseId,
        )

        user.notifications = user.notifications.filter(
          (not) => not.expense.id !== expenseId,
        )
        user.preferences = user.preferences.filter((p) => {
          return p.expense.id !== expenseId
        })
        console.log('Updated Expense', updatedExpense)
        user.expenses = user.expenses.concat(updatedExpense)
        const updatedUser = await UserService.update(user, user.id)
        setUser(updatedUser)
      } catch (err) {
        alert('Could not accept/delete notification sucessfully')
        console.error(err)
      }
    }

    socket.emit('newNotification', {
      senderUser: { username: user.username, id: user.id },
      recieverUsers: [n.senderUser.username],
      expense: n.expense,
      acceptTransfer: true,
    })
  }

  //Styles
  const paperStyle = {
    width: '100%',
    height: '100%',
  }

  const boxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Typography
          sx={{ maxWidth: '100%' }}
          className="title"
          variant="subtitle2"
        >
          {user.name}
        </Typography>
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {notifications.length > 0 ? (
              <Avatar sx={{ width: 20, height: 20 }} style={avatarStyle}>
                <SettingsIcon sx={{ width: 15, height: 15 }} />{' '}
              </Avatar>
            ) : (
              <Avatar sx={{ width: 20, height: 20 }}>
                <SettingsIcon sx={{ width: 15, height: 15 }} />{' '}
              </Avatar>
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'auto',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {notifications.length > 0
          ? notifications?.map((n, i) => (
              <MenuItem key={i} style={{ padding: '5px 12px' }}>
                <Paper align="center" elevation={0} style={paperStyle}>
                  <Box style={boxStyle}>
                    <ListItemIcon style={{ alignItems: 'flex-end' }}>
                      <NotificationsIcon fontSize="small" />
                    </ListItemIcon>
                    {n.transfer
                      ? `${
                          n.senderUser.username
                        } wants to transfer you a debt of: \n$${
                          n.expense.debtors.filter(
                            (e) => e.username === n.senderUser.username,
                          )[0]?.amount
                        }`
                      : n.acceptTransfer === null
                      ? `${n.senderUser.username} has created a new expense with u`
                      : n.acceptTransfer
                      ? `${n.senderUser.username} has accept your debt transfer`
                      : `${n.senderUser.username} has reject your debt transfer`}
                  </Box>
                  <Divider style={{ margin: '5px 0' }} />
                  {n.transfer ? (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        style={btnStyle}
                        onClick={() => handleTransferAccept(n)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        style={btnStyle}
                        onClick={() => handleDecline(n, i)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      style={btnStyle}
                      onClick={() => handleAccept(n, i)}
                    >
                      Accept
                    </Button>
                  )}
                </Paper>
              </MenuItem>
            ))
          : null}
        {notifications.length > 0 ? (
          <MenuItem>
            <Button
              size="small"
              variant="contained"
              style={{
                margin: '0 8px 0 8px',
              }}
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </MenuItem>
        ) : null}
        <Divider />
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
