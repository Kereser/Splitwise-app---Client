import React from 'react'

//mui components
import { Stack, Divider } from '@mui/material'

//mui icons
import ListAltIcon from '@mui/icons-material/ListAlt'
import PeopleIcon from '@mui/icons-material/People'

//components
import { Link } from 'wouter'

function MainOptions() {
  //Hacer mis propios botones y controlar su selected con la ruta actual

  const stackStyle = {
    margin: '10px 10px',
  }

  const handleClick = (e) => {
    const links = document.querySelectorAll('.link-btn')
    console.log(links)
    for (let i = 0; i < links.length; i++) {
      links[i].classList.remove('selected-link')
    }
    e.target.className += ' selected-link'
    console.log(e.target)
  }

  // remove.onclick = () => {
  //   const el = document.querySelector('#el');
  //   if (el.classList.contains("red")) {
  //     el.classList.remove("red");

  //   }
  // }

  return (
    <Stack
      style={stackStyle}
      spacing={0.5}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <Link
        href="Dashboard"
        id="selected-link-dashboard"
        className="link-btn"
        onClick={handleClick}
      >
        <ListAltIcon sx={{ mr: 0.5, my: 0.1 }} />
        Dashboard
      </Link>
      <Link
        href="Friends"
        className="link-btn"
        id="selected-link-friends"
        onClick={handleClick}
      >
        <PeopleIcon sx={{ mr: 0.5, my: 0.1, ml: 0.4 }} />
        Friends
      </Link>
    </Stack>
  )
}

export default MainOptions
