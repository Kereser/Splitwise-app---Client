import React from 'react'

//mui icons
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { FlexContainer } from '../styledComponents/FlexContainer'
import { Input } from '../styledComponents/Input'

function FilterExpenses({ filter, setFilter }) {
  return (
    <FlexContainer>
      <FilterAltIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
      <Input
        placeholder="Filter by description"
        value={filter}
        onChange={({ target }) => setFilter(target.value)}
      />
    </FlexContainer>
  )
}

export default FilterExpenses
