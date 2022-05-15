import { request, socket } from "./api.js";

const title = document.getElementById("title");
const players = document.getElementById("players");

(async () => {
    let game;
    if (localStorage.game) {
        game = JSON.parse(localStorage.game)
    }
    else {
        const res = await request("GET", "/game")
        if (res.ok) game = res.body
        else {
            title.innerHTML = `<p>Failed to load a game: ${res.statusText}</p>`
        }
    }

    if (game) {
        const titleString = `${game.players[0].name}'s Game`
        document.title = titleString + " | Wargame"
        title.innerHTML = `<p>${titleString}</p>`

        for (let player of game.players) {
            addPlayer(player)
        }
    }
})()

const leaveBtn = document.getElementById("leave")
leaveBtn.addEventListener("click", async e => {
    const res = request("POST", "/game/leave");
    location.pathname = ""
})

function addPlayer(player) {
    const element = new DOMParser().parseFromString(
        `<div class="player">
            <p>${player.name}</p>
            <div class="faction">
                ${player.faction ? 
                    `<p>${player.faction.name}</p>
                     <div class="player-colour" style="background-color: ${player.faction.colour}"></div>`
                     :
                    `<p>No faction selected</p>
                    <div class="player-colour" style="background-color: gray"></div>`
                }
            </div>
        </div>`, 'text/html').activeElement.children.item(0)
    players.appendChild(element)
}

function removePlayer(index) {
    players.children.item(index).remove()
}

socket.on('playerJoin', addPlayer)
socket.on('playerLeave', removePlayer)