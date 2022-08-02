/* Things to do with the Start/Ready button, not necessarily starting the game */

import { socket } from "../shared/api"
import { game, Player } from "./lobby"

const startButton = document.getElementById("start")

startButton.addEventListener("click", e => {
    const client = game.players[game.clientIndex]
    if (client.index === 0) {
        // Check if all players are ready 

        // If yes, start game
    }
    else {
        // Toggle ready status of player
        // game.players[game.clientIndex].ready = !client.ready
        // console.log(game.players[game.clientIndex])
        socket.emit("editPlayer", { ready: !client.ready })
    }
})

export function toggleReadyStatus(player: Player) {
    player.ready = !player.ready
    console.log(player.ready)
    // Change HTML of Start button
    if (player.index === game.clientIndex) {
        player.ready 
            ? startButton.innerHTML = "Unready"
            : startButton.innerHTML = "Ready"
    }
}