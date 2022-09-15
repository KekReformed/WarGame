/* Things to do with the Start/Ready button, not necessarily starting the game */

import { socket } from "../shared/api"
import { game, Player } from "./lobby"

export const startButton = document.getElementById("start")
const readyStatus = document.getElementById("readyStatus")

export default () => {
    changeStartButtonStatus()
    renderReadyStatusText()
}

startButton.addEventListener("click", e => {
    if (game.client.index === 0) {
        if (allPlayersReady()) {
            socket.emit("gameStart")
        }
    }
    else socket.emit("editPlayer", { ready: !game.client.ready })
})

export function toggleReadyStatus(player: Player) {
    if (player.ready) game.playersReady --
    else game.playersReady ++
    
    game.players[player.index].ready = !player.ready
}

function changeStartButtonStatus() {
    if (game.client.index === 0) {
        startButton.innerHTML = "<p>Start</p>"
        if (allPlayersReady()) {
            startButton.classList.remove("disabled")
            startButton.classList.add("enabled")
        }
        else {
            startButton.classList.add("disabled")
            startButton.classList.remove("enabled")
        }
    }
    else {
        if (game.client.ready) startButton.innerHTML = "<p>Unready</p>"
        else startButton.innerHTML = "<p>Ready</p>"
    }
}

function allPlayersReady() {
    const playersWithoutFaction = game.players.filter(p => !p.faction.name || !p.faction.colour)
    return playersWithoutFaction.length === 0 && game.playersReady === game.players.length
}

export function renderReadyStatusText() {
    readyStatus.innerHTML = `<p>${game.playersReady}/${game.players.length} players ready.</p>`
}