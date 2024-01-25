/** Handles styling/text updates for the socket connection status of the client and players. */
import { socket } from "../shared/api"

const circle = document.getElementById('connectStatus')
const text = document.getElementById('connectStatusText')

socket.io.on('open', () => {
  text.innerHTML = 'Connected'
  circle.style.backgroundColor = 'green'
})

socket.io.on('reconnect_attempt', () => {
  text.innerHTML = 'Reconnecting'
  circle.style.backgroundColor = 'orange'
})

socket.io.on('close', () => {
  text.innerHTML = 'Disconnected'
  circle.style.backgroundColor = 'red'
})

socket.io.on('error', () => {
  text.innerHTML = 'Connection failed'
  circle.style.backgroundColor = 'red'
})

socket.io.on('reconnect_failed', () => {
  text.innerHTML = `Failed to reach server after multiple attempts. Try refreshing.`
  circle.style.backgroundColor = 'red'
})