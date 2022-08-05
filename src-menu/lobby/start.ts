/* Things to do with the Start/Ready button, not necessarily starting the game */

import { socket } from "../shared/api"
import { game, Player } from "./lobby"

export const startButton = document.getElementById("start")
const readyStatus = document.getElementById("readyStatus")

export default () => {
    changeStartButtonText()
    renderReadyStatusText()
}

startButton.addEventListener("click", e => {
    const client = game.players[game.clientIndex]
    if (client.index === 0) {
        // Check if all players are ready 

        // If yes, start game
    }
    else socket.emit("editPlayer", { ready: !client.ready })
})

export function toggleReadyStatus(player: Player) {
    if (player.ready) game.playersReady --
    else game.playersReady ++
    renderReadyStatusText()

    game.players[player.index].ready = !player.ready

    if (player.index === game.clientIndex) changeStartButtonText()
}

function changeStartButtonText() {
    if (game.players[game.clientIndex].ready) startButton.innerHTML = "<p>Unready</p>"
    else startButton.innerHTML = "<p>Ready</p>"
}

function renderReadyStatusText() {
    readyStatus.innerHTML = `<p>${game.playersReady}/${game.players.length} players ready.</p>`
}