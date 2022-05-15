import React from 'react'
import { Paper, Box, Divider } from '@mui/material'

function ParcialPaymentPopUp({ debtor, payment, setPayment }) {
  return (
    <>
      <Paper>
        <Box className="title-popup-btn">Parcial payment</Box>
      </Paper>
      <Box
        style={{
          margin: '15px 7px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box style={{ margin: '5px 0' }}>Enter the value u want to pay:</Box>
        <Box
          component={'input'}
          className="input"
          style={{ fontSize: '1.5rem', width: '56px', margin: '0 auto' }}
          placeholder={`${debtor[0].amount}`}
          value={payment}
          type="number"
          min={0}
          max={debtor[0].amount}
          required
          onChange={(e) => setPayment(e.target.value)}
        />
      </Box>
      <Divider />
    </>
  )
}

export default ParcialPaymentPopUp
