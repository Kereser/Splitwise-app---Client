import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import BalanceIcon from '@mui/icons-material/Balance'

export default function BasicSelect({ percentage, setPercentage }) {
  const handleChange = (event) => {
    setPercentage(event.target.value)
  }

  return (
    <Box sx={{ width: 90 }}>
      <FormControl fullWidth>
        <InputLabel>How split</InputLabel>
        <Select
          value={percentage}
          label="How split"
          onChange={handleChange}
          size="small"
        >
          <MenuItem value={50}>
            <BalanceIcon />
          </MenuItem>
          <MenuItem value={10}>10%</MenuItem>
          <MenuItem value={20}>20%</MenuItem>
          <MenuItem value={40}>40%</MenuItem>
          <MenuItem value={60}>60%</MenuItem>
          <MenuItem value={80}>80%</MenuItem>
          <MenuItem value={90}>90%</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
