import React from 'react'

//mui components
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

//components
import { Link } from 'wouter'

function MainOptions() {
  const [view, setView] = React.useState('web')

  const handleChange = (event, newView) => {
    setView(newView)
  }

  return (
    <ToggleButtonGroup
      color="primary"
      value={view}
      exclusive
      orientation="vertical"
      size="small"
      onChange={handleChange}
    >
      <ToggleButton value="Dashboard" size="small">
        <Link href="Dashboard" className="btn-black">
          Dashboard
        </Link>
      </ToggleButton>
      ,
      <ToggleButton value="Friends" variant="text" size="small">
        <Link href="Friends" className="btn-black">
          Friends
        </Link>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default MainOptions
