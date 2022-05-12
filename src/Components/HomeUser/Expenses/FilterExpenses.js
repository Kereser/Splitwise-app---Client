import React from 'react'

//mui components
import { Box, TextField } from '@mui/material'

//mui icons
import FilterAltIcon from '@mui/icons-material/FilterAlt'

function FilterExpenses({ filter, setFilter }) {
  const boxStyle = {
    margin: '5px 12px 15px 12px',
  }
  return (
    <Box style={boxStyle}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <FilterAltIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          label="Enter a filter here"
          variant="standard"
          value={filter}
          color="secondary"
          onChange={({ target }) => setFilter(target.value)}
        />
      </Box>
    </Box>
  )
}

export default FilterExpenses
