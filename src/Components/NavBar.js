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

export default function NavBar({ notifications, user, setUser }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAcceptAll = () => {
    const confirm = window.confirm(
      'You are about to accept all notifications, including those who ask u for transfer a debt \n\n Are you sure?',
    )
    if (confirm) {
      setUser({ ...user, notifications: [] })
    }
  }

  const handleAccept = async (notif) => {
    const originalNotis = user.notifications
    console.log(user)
    console.log('expense: ', notif)
    const newNotis = originalNotis.filter((n) => {
      return n.expense.id !== notif.expense.id
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

  // const handleDecline = (notification) => {}

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Typography sx={{ minWidth: 100 }} className="title">
          Home
        </Typography>
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {notifications.length > 0 ? (
              <Avatar sx={{ width: 32, height: 32 }} style={avatarStyle}>
                <SettingsIcon />{' '}
              </Avatar>
            ) : (
              <Avatar sx={{ width: 32, height: 32 }}>
                <SettingsIcon />{' '}
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
              //! Acomodar la key para no eliminar todad las notificaciones.
              <MenuItem key={i}>
                <Paper align="center" elevation={0}>
                  <ListItemIcon>
                    <NotificationsIcon fontSize="small" />
                  </ListItemIcon>
                  {`${n.senderUser} has created a new expense with u`}
                  <Divider style={{ margin: '5px 0' }} />
                  <Button
                    size="small"
                    variant="contained"
                    style={btnStyle}
                    onClick={() => handleAccept(n)}
                  >
                    Accept
                  </Button>
                </Paper>
              </MenuItem>
            ))
          : null}
        {notifications.length > 0 ? (
          <MenuItem>
            <Button
              size="small"
              variant="contained"
              style={btnStyle}
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </MenuItem>
        ) : null}
        <Divider />
        <MenuItem onClick={() => console.log('Sirve el click aqui')}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
