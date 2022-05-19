import { request, socket } from "../shared/api.js";

const dom = new DOMParser()

const title = document.getElementById("title");
const players = document.getElementById("players");

const secret = localStorage.secret;

let game;
(async () => {
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

        for (const i in game.players) {
            const player = game.players[i]
            if (i == game.clientIndex) {
                addPlayer(player, i === "0", true)
            }
            else addPlayer(player, i === "0")
        }
    }
})()

const leaveBtn = document.getElementById("leave")
leaveBtn.addEventListener("click", async e => {
    await request("POST", "/game/leave", undefined, {authorization: secret});
    localStorage.clear()
    location.pathname = ""
})

function addPlayer(player, host=false, client=false) {
    const element = dom.parseFromString(
        `<div class="player" ${client ? 'id="client"' : ''}>
            ${generatePlayerHtml(player)}
        </div>`, 'text/html').activeElement.children.item(0)

    if (client) {
        const faction = element.children.item(1)
        const [factionName, factionInput, factionColour] = faction.children

        factionName.addEventListener("click", e => changeToInput(factionName, factionInput))

        factionInput.style.width = factionInput.value.length + 3 + "ch"
        factionInput.addEventListener("input", e => factionInput.style.width = factionInput.value.length + 5 + "ch")
        factionInput.addEventListener("blur", e => changeToText(factionName, factionInput))
        factionInput.addEventListener("keydown", e => e.key === "Enter" && changeToText(factionName, factionInput))
    }

    players.appendChild(element)
}

function generatePlayerHtml(player) {
    const input = `<input class="input" type="text" style="display: none"/>`

    if (!player.faction) player.faction = {}
    return (
        `<p>${player.name}</p>
        <div class="faction">
            <p>${player.faction.name || "No faction selected"}</p>
            ${input}
            ${player.faction.colour
                ? `<div class="player-colour" style="background-color: ${player.faction.colour}"></div>`
                : `<div class="player-colour no-faction"></div>`
            }
        </div>`
    )
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
    if (input.value && input.value !== text.innerHTML) {
        text.innerHTML = input.value
        game.players[game.clientIndex].faction.name = input.value
        saveGame()
        socket.emit("editPlayer", game.players[game.clientIndex])
    }
}

function editPlayer(player) {
    console.log(player.index, game.clientIndex)
    if (player.index === game.clientIndex) return;

    players.children.item(player.index).innerHTML = generatePlayerHtml(player)
    game.players[player.index] = player
    saveGame()
}

function removePlayer(index) {
    delete game.players[index]
    players.children.item(index).remove()
    saveGame()
}

function saveGame() {
    localStorage.game = JSON.stringify(game)
}

socket.on('playerJoin', addPlayer)
socket.on('playerEdit', editPlayer)
socket.on('playerLeave', removePlayer)
socket.on('exception', msg => console.error(`Socket request rejected: ${msg}`))