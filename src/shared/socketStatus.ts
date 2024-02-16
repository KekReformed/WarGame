/** Handles styling/text updates for the socket connection status of the client and players. */
import { delay } from "./modules";
import { socket } from "./api"

const circle = document.getElementById('connectStatus')
const text = document.getElementById('connectStatusText')
let interval: NodeJS.Timeout;

socket.io.on('open', () => {
  clearInterval(interval)
  text.innerHTML = 'Connected'
  circle.style.backgroundColor = 'green'
})

socket.io.on('reconnect_attempt', () => {
  text.innerHTML = 'Reconnecting'
  interval = setInterval(async () => {
    if (text.innerHTML.endsWith('...')) {
      text.innerHTML = 'Reconnecting'
      await delay(1)
    }
    text.innerHTML += '.'
  }, 400)
  circle.style.backgroundColor = 'orange'
})

socket.io.on('close', () => {
  text.innerHTML = 'Disconnected'
  circle.style.backgroundColor = 'red'
})

socket.io.on('error', () => {
  clearInterval(interval)
  text.innerHTML = 'Connection failed'
  circle.style.backgroundColor = 'red'
})

socket.io.on('reconnect_failed', () => {
  clearInterval(interval)
  text.innerHTML = `Failed to reach server after multiple attempts. Try refreshing.`
  circle.style.backgroundColor = 'red'
})