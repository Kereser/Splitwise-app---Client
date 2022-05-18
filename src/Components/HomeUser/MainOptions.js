import React from 'react'

//mui components
import { Stack, Divider, Box } from '@mui/material'

//mui icons
import ListAltIcon from '@mui/icons-material/ListAlt'

//components
import { Link } from 'wouter'

//store
import useStore from '../../store/state'

function MainOptions() {
  const user = useStore((state) => state.user)
  const friends = user.friends.map((friend) => friend.username)

  //styles
  const boxStyle = {
    margin: ' 0 10px 10px 10px',
  }

  const boxFlex = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '15px 0 0',
    alignItems: 'flex-start',
    borderRadius: '2px',
  }

  // event handlers
  const handleClick = (e) => {
    const links = document.querySelectorAll('.link-btn')
    console.log(links)
    for (let i = 0; i < links.length; i++) {
      links[i].classList.remove('selected-link')
    }
    e.target.className += ' selected-link'
    console.log(e.target)
  }

  return (
    <Box style={boxStyle}>
      <Link
        href="/Dashboard"
        id="selected-link-dashboard"
        className="link-btn"
        onClick={handleClick}
      >
        <ListAltIcon sx={{ mr: 0.5, my: 0.1 }} />
        Dashboard
      </Link>
      <Box className="add-container" style={boxFlex}>
        <Box style={{ marginBottom: '3px' }}>Friends</Box>
        <Box className="add-btn">
          <i className="fa-thin fa-plus"></i>add
        </Box>
      </Box>
      <Stack
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={0}
      >
        {friends.map((friend) => {
          return (
            <Link
              href={`/Friends/${friend}`}
              className="link-btn"
              key={friend}
              onClick={handleClick}
            >
              {friend}
            </Link>
          )
        })}
      </Stack>
    </Box>
  )
}

export default MainOptions
