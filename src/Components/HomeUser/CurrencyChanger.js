//mui components
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  Select,
} from '@mui/material'

//store
import useStore from '../../store/state'

function CurrencyChanger() {
  const toCurrency = useStore((state) => state.toCurrency)
  const setToCurrency = useStore((state) => state.setToCurrency)

  const handleChange = ({ target }) => {
    setToCurrency(target.value)
  }

  //style
  const boxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }

  return (
    <Box style={boxStyle}>
      <Typography component={'span'}>Set a currency: </Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel color="secondary">Currency</InputLabel>
        <Select
          value={toCurrency}
          label="Currency"
          onChange={handleChange}
          size="small"
          color="secondary"
        >
          <MenuItem value="USD">
            <em>Currency</em>
          </MenuItem>
          <MenuItem value={'USD'}>USD</MenuItem>
          <MenuItem value={'COP'}>COP</MenuItem>
          <MenuItem value={'EUR'}>EUR</MenuItem>
          <MenuItem value={'ARS'}>ARS</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default CurrencyChanger
