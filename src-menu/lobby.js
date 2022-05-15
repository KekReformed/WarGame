import { request } from "./api.js";

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

function addPlayer(player) {
    const element = new DOMParser().parseFromString(
        `<div class="player">
            <p>${player.name}</p>
            <div class="faction">
                ${player.faction ? 
                    `<p>${player.faction.name}</p>
                     <div class="player-colour" style="background-color: ${player.faction.colour}"></div>`
                     :
                    `<p class="no-faction">No faction selected</p>
                    <div class="player-colour" style="background-color: gray"></div>`
                }
            </div>
        </div>`, 'text/html').activeElement.children.item(0)
    players.appendChild(element)
}