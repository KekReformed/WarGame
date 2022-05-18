import { request, socket } from "../shared/api.js";

const dom = new DOMParser()

const title = document.getElementById("title");
const players = document.getElementById("players");

const secret = localStorage.secret;

(async () => {
    let game;
    if (localStorage.game) {
        game = JSON.parse(localStorage.game)
    }
    else {
        const res = await request("GET", "/game", undefined, {authorization: secret}).catch(e => {
            title.innerHTML = `<p>Failed to load a game: ${e.message}</p>`
        })
        if (res) game = res.body
    }

    if (game) {
        localStorage.game = JSON.stringify(game)
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
    await request("POST", "/game/leave", undefined, {authorization: secret});
    localStorage.clear()
    location.pathname = ""
})

function addPlayer(player) {
    const input = `<input class="input" type="text" style="display: none"/>`
    const element = dom.parseFromString(
        `<div class="player">
            <p>${player.name}</p>
            <div class="faction">
                ${player.faction ? 
                    `<p>${player.faction.name}</p>
                     ${input}
                     <div class="player-colour" style="background-color: ${player.faction.colour}"></div>`
                     :
                    `<p>No faction selected</p>
                     ${input}
                     <div class="player-colour" style="background-color: gray"></div>`
                }
            </div>
        </div>`, 'text/html').activeElement.children.item(0)

    const faction = element.children.item(1)
    const [factionName, factionInput, factionColour] = faction.children

    factionName.addEventListener("click", e => changeToInput(factionName, factionInput))

    factionInput.style.width = factionInput.value.length + 3 + "ch"
    factionInput.addEventListener("input", e => factionInput.style.width = factionInput.value.length + 5 + "ch")
    factionInput.addEventListener("blur", e => changeToText(factionName, factionInput))
    factionInput.addEventListener("keydown", e => e.key === "Enter"  && changeToText(factionName, factionInput))

    players.appendChild(element)
}

function changeToInput(text, input) {
    text.style.display = "none"
    input.style.display = "block"
    input.value = text.innerHTML
    input.select()
}

function changeToText(text, input) {
    input.style.display = "none"
    text.style.display = "block"
    text.innerHTML = input.value
}

function removePlayer(index) {
    players.children.item(index).remove()
}

socket.on('playerJoin', addPlayer)
socket.on('playerLeave', removePlayer)