import React, { useState } from 'react'

//mui components
import { Box, Paper, Divider, Avatar } from '@mui/material'

//components
import MainExpensivePopup from './MainExpensivePopup'

//Services to update
import UserService from '../services/user'
import ExpenseService from '../services/expense'

//Mui icons
import ReceiptIcon from '@mui/icons-material/Receipt'

//store
import useStore from '../store/state'
import { eventSender } from '../socketEvents/eventSender'

//StyledComponents
import { Input } from '../styledComponents/Input'
import { FlexContainer } from '../styledComponents/FlexContainer'
import { SelectButtons } from '../styledComponents/SelectButtons'
import { ExpenseButton } from '../pages/HomeUser/styledComponents/Button'

function PopupAddExpense({ newExpense, user, setNewExpense, friend = null }) {
  //State to expensive
  const [toUser, setToUser] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [percentage, setPercentage] = useState(50)

  //store
  const socket = useStore((state) => state.socket)
  const setUser = useStore((state) => state.setUser)
  const setAlert = useStore((state) => state.setAlert)

  console.log(percentage)

  const handleNewExpense = async () => {
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

      setNewExpense(false)
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
    <Box>
      <MainExpensivePopup trigger={newExpense}>
        <Paper>
          <Box className="title-popup-btn">Add an expense</Box>
        </Paper>
        <FlexContainer>
          <span style={{ flex: 1 }}>Debtors: </span>
          {friend ? (
            <div style={{ flex: 3 }}>
              <Input defaultValue={friend} required disabled />
            </div>
          ) : (
            <div style={{ flex: 3 }}>
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
          <div style={{ flex: 3 }}>
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
          <div style={{ flex: 3 }}>
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
        <FlexContainer justifyContent={'flex-end'} pr={'0.2em'}>
          <ExpenseButton onClick={() => setNewExpense(false)}>
            Close
          </ExpenseButton>
          <ExpenseButton onClick={handleNewExpense}>Save</ExpenseButton>
        </FlexContainer>
      </MainExpensivePopup>
    </Box>
  )
}

export default PopupAddExpense
