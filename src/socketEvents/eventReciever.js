//service
import UserService from '../services/user'

export function eventReciever(event, user = null, socket, setUser) {
  socket.on(event, async () => {
    const updatedUser = await UserService.getOneUser(user.id)
    setUser(updatedUser)
  })
}
