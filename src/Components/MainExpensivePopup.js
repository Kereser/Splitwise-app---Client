import { Box, Paper } from '@mui/material'
import React from 'react'

const MainExpensivePopup = ({ children, trigger }) => {
  return trigger ? (
    <Box className="popup">
      <Paper elevation={7} className="popup-inner">
        {children}
      </Paper>
    </Box>
  ) : null
}

export default MainExpensivePopup
