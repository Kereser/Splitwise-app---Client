import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          ':hover': {
            backgroundColor: '#6d33ff',
            color: '#fff',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          padding: '0 5px',
          ':hover': {
            backgroundColor: '#6d33ff',
          },
        },
      },
    },
  },
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root'),
)

