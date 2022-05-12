import React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

//icons
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Logout from '@mui/icons-material/Logout'
import { Button, Paper } from '@mui/material'

export default function NavBar({ notifications, setNotifications }) {
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
    // const newNotis = notification.filter((n) => n.id !== notification.id)
    setNotifications([])
  }

  const handleAccept = (index) => {
    const newNotis = notifications.filter((_n, i) =>
      i === index ? false : true,
    )
    setNotifications(newNotis)
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
                    onClick={() => handleAccept(i)}
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
