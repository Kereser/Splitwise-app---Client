import { useState } from 'react'

//mui components
import { Stack, Divider } from '@mui/material'

//mui icons
import ListAltIcon from '@mui/icons-material/ListAlt'

//wouter
import { Link } from 'wouter'

//store
import useStore from '../store/state'
import FriendDialog from '../pages/Friend/Components/FriendDialog'

//components
import { FlexContainer } from '../styledComponents/FlexContainer'

function MainOptions() {
  const [open, setOpen] = useState(false)
  const user = useStore((state) => state.user)
  const friends = user.friends.map((friend) => friend?.username)

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

  const handleAddFriend = () => {
    setOpen(true)
  }

  return (
    <div style={{ margin: ' 0 10px 10px 10px' }}>
      <Link
        href="/Dashboard"
        id="selected-link-dashboard"
        className="link-btn"
        onClick={handleClick}
      >
        <ListAltIcon sx={{ mr: 0.5, my: 0.1 }} />
        Dashboard
      </Link>
      <FlexContainer
        className="add-container"
        alignItems={'flex-start'}
        justifyContent="space-between"
        pu={'.1em'}
        pr={'0'}
      >
        <div>Friends</div>
        <div className="add-btn" onClick={handleAddFriend}>
          <i className="fa-thin fa-plus"></i>add
        </div>
      </FlexContainer>
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
      <FriendDialog open={open} setOpen={setOpen} user={user} />
    </div>
  )
}

export default MainOptions
