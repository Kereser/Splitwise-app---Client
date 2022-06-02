import React, { useState } from 'react'

//mui components
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  Avatar,
} from '@mui/material'

//Mui icons
import ReceiptIcon from '@mui/icons-material/Receipt'

import { Button } from '../styledComponents/Button'
import { FlexContainer } from '../styledComponents/FlexContainer'
import { SelectButtons } from '../styledComponents/SelectButtons'
import { Input } from '../styledComponents/Input'
import { ExpenseButton } from '../pages/HomeUser/styledComponents/Button'

//store
import useStore from '../store/state'

//Service
import ExpenseService from '../services/expense'
import UserService from '../services/user'

//events
import { eventSender } from '../socketEvents/eventSender'

function NewExpenseDialog({ user, friend = null }) {
  //State to expensive
  const [toUser, setToUser] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [percentage, setPercentage] = useState(50)
  const [open, setOpen] = useState(false)

  const socket = useStore((state) => state.socket)
  const setUser = useStore((state) => state.setUser)
  const setAlert = useStore((state) => state.setAlert)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleNewExpense = async () => {
    setOpen(false)
    const debtor = friend ? friend : toUser

    try {
      const newExpense = await ExpenseService.create({
        debtor,
        description,
        balance,
        paidBy,
        percentage,
        user,
      })

      const updatedUser = await UserService.getOneUser(user.id)
      setUser(updatedUser)

      const event = 'newNotification'
      const payload = {
        expense: newExpense,
        senderUser: { username: user.username, id: user.id },
        recieverUsers: newExpense.debtors.map((d) => d.username),
      }

      eventSender(socket, event, payload)

      setBalance(0)
      setDescription('')
      setToUser('')
      setPaidBy('')
      setPercentage(50)
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response.data.message,
        trigger: true,
      })
    }
  }

  const options = [10, 20, 40, 50, 60, 80, 90]

  return (
    <div>
      <Button onClick={handleClickOpen} primary>
        New expense
      </Button>
      <Dialog open={open} keepMounted onClose={handleClose}>
        <DialogContent>
          <Paper>
            <Box className="title-popup-btn">Add an expense</Box>
          </Paper>
          <FlexContainer>
            <span style={{ flex: 1 }}>Debtors: </span>
            {friend ? (
              <div>
                <Input defaultValue={friend} required disabled />
              </div>
            ) : (
              <div>
                <Input
                  placeholder="username, username, ..."
                  required
                  value={toUser}
                  onChange={(e) => setToUser(e.target.value)}
                />
              </div>
            )}
          </FlexContainer>
          <Divider />
          <FlexContainer>
            <div style={{ flex: 1 }}>
              <Avatar>
                <ReceiptIcon />
              </Avatar>
            </div>
            <div>
              <Input
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                required
                min={0}
                placeholder="0"
                type={'number'}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          </FlexContainer>
          <FlexContainer>
            <div style={{ flex: 1 }}>Paid-by:</div>
            <div>
              <Input
                placeholder={`${user.username}, username, ...`}
                required
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
              />
            </div>
          </FlexContainer>
          <FlexContainer>
            <div>Split</div>
            <div>
              <SelectButtons
                value={percentage}
                onChange={({ target }) => setPercentage(+target.value)}
              >
                {options.map((o, i) => {
                  return (
                    <React.Fragment key={i}>
                      <option value={o}>{`${o}%`}</option>
                    </React.Fragment>
                  )
                })}
              </SelectButtons>
            </div>
          </FlexContainer>
          <Divider />
        </DialogContent>
        <DialogActions>
          <ExpenseButton onClick={() => setOpen(false)}>Close</ExpenseButton>
          <ExpenseButton onClick={handleNewExpense}>Save</ExpenseButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default NewExpenseDialog
