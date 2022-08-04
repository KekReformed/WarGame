/* Things to do with the Start/Ready button, not necessarily starting the game */

import { socket } from "../shared/api"
import { game, Player } from "./lobby"

export const startButton = document.getElementById("start")

startButton.addEventListener("click", e => {
    const client = game.players[game.clientIndex]
    if (client.index === 0) {
        // Check if all players are ready 

        // If yes, start game
    }
    else socket.emit("editPlayer", { ready: !client.ready })
})

export function toggleReadyStatus(player: Player) {
    game.players[player.index].ready = !player.ready

    if (player.index === game.clientIndex) {
        if (player.ready) startButton.innerHTML = "<p>Unready</p>"
        else startButton.innerHTML = "<p>Ready</p>"
    }
}