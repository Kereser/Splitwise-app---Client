import { useState } from 'react'
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
  Button,
  Paper,
} from '@mui/material'

//icons
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Logout from '@mui/icons-material/Logout'

//services
import UserService from '../../../services/user'
import ExpenseService from '../../../services/expense'

//store
import useStore from '../../../store/state'

//wouter
import { useLocation } from 'wouter'

//Event sender
import { eventSender } from '../../../socketEvents/eventSender'

export default function NavBar({ notifications, user, setUser }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [, setLocation] = useLocation()
  const socket = useStore((state) => state.socket)
  const open = Boolean(anchorEl)

  //? styles
  const avatarStyle = {
    backgroundColor: '#66b165',
  }

  const btnStyle = {
    margin: '0 8px 5px 8px',
  }

  const paperStyle = {
    width: '100%',
    height: '100%',
  }

  const boxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  //Event handlers
  const handleLogOut = () => {
    setLocation('/')
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
      try {
        const updatedUser = await UserService.update(
          { user, action: { type: 'AcceptAll', n: null } },
          user.id,
        )
        setUser(updatedUser)
      } catch (err) {
        alert('Could not accept all notification sucessfully')
        console.error(err)
      }
    }
  }

  const handleAccept = async (i) => {
    try {
      const updatedUser = await UserService.update(
        { user, action: { type: 'AcceptOne', index: i } },
        user.id,
      )
      setUser(updatedUser)
    } catch (err) {
      alert('Could not accept/delete notification sucessfully')
      console.error(err)
    }
  }

  const handleTransferDecline = async (n, i) => {
    const event = 'newNotification'
    const payload = {
      senderUser: { username: user.username, id: user.id },
      recieverUsers: [n.senderUser.username],
      expense: n.expense,
      acceptTransfer: false,
    }

    try {
      const updatedUser = await UserService.update(
        { user, action: { type: 'AcceptOne', index: i } },
        user.id,
      )
      setUser(updatedUser)
      eventSender(socket, event, payload)
    } catch (err) {
      alert('Could not accept/delete notification sucessfully')
      console.error(err)
    }
  }

  const handleTransferAccept = async (n) => {
    console.log(n)
    const expenseId = n.expense.id
    const event = 'newNotification'
    const payload = {
      senderUser: { username: user.username, id: user.id },
      recieverUsers: [n.senderUser.username],
      expense: n.expense,
      acceptTransfer: true,
    }

    try {
      await ExpenseService.update(
        {
          notification: { expense: n.expense, senderUser: n.senderUser },
          user,
          type: 'Transfer',
        },
        expenseId,
      )
      const updatedUser = await UserService.getOneUser(user.id)
      setUser(updatedUser)
      eventSender(socket, event, payload)
    } catch (err) {
      alert('Could not accept/delete notification sucessfully')
      console.error(err)
    }
  }

  return (
    <>
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
                        onClick={() => handleTransferDecline(n, i)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      style={btnStyle}
                      onClick={() => handleAccept(i)}
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
    </>
  )
}
