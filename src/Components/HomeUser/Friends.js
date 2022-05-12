import React from 'react'

//mui components
import { Box, Typography } from '@mui/material'

//store
import useStore from '../../store/state'

function Friends() {
  const user = useStore((state) => state.user)

  const friends = user.friends

  //! Ver con q mas completo los datos en friends.

  if (friends.length === 0) {
    return <Box>There are no friends to show.</Box>
  } else {
    return (
      <>
        {friends.map((friend) => (
          <Box key={friend.id}>
            {console.log(friend)}
            <Typography variant="h4">{friend.username}</Typography>
          </Box>
        ))}
      </>
    )
  }
}

export default Friends
