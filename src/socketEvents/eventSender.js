export function eventSender(socket, event, payload) {
  socket.emit(event, payload)
}
