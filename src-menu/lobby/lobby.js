import { request, socket } from "../shared/api.js";

const dom = new DOMParser()

const title = document.getElementById("title");
const players = document.getElementById("players");

const colours = document.getElementById("colours")
let coloursDisplayed = false

const colourList = [
    "#fff",
    "#cf1818",
    "#189ab1",
    "#861373",
    "#53e07d",
    "#0d2e0a",
    "#e67777",
    "#f0a94c",
    "#020202",
    "#f8649d"
]
let disabledColours = [];
let colourIndex;
/** Global HTML element - the client's colour */
let clientColour;

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
            if (player.faction.colour) disabledColours.push(player.faction.colour)
            addPlayer(player, i === "0", i == game.clientIndex)
        }

        // Generate colour select box
        renderColours()
        
        positionColoursBox(clientColour)
        window.onresize = () => positionColoursBox(clientColour)
    }
})()

const leaveBtn = document.getElementById("leave")
leaveBtn.addEventListener("click", async e => {
    await request("POST", "/game/leave", undefined, {authorization: secret});
    localStorage.clear()
    location.pathname = ""
})

function addPlayer(player, host=false, client=false) {
    const element = createElement(
        `<div class="player" ${client ? 'id="client"' : ''}>
            ${generatePlayerHtml(player)}
        </div>`)
    players.appendChild(element)

    if (client) {
        colourIndex = colourList.indexOf(player.faction.colour)

        const faction = element.children.item(1)
        const [factionName, factionInput, factionColour] = faction.children
        clientColour = factionColour

        factionName.addEventListener("click", e => changeToInput(factionName, factionInput))

        factionInput.style.width = factionInput.value.length + 3 + "ch"
        factionInput.addEventListener("input", e => factionInput.style.width = factionInput.value.length + 5 + "ch")
        factionInput.addEventListener("blur", e => changeToText(factionName, factionInput))
        factionInput.addEventListener("keydown", e => e.key === "Enter" && changeToText(factionName, factionInput))

        factionColour.addEventListener("click", e => toggleColours())
    }
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

function renderColours() {
    colours.innerHTML = "<p>Unselect Colour</p>" // add a click handler for unselecting colour
    for (let i in colourList) {
        const colour = colourList[i]
        const disabled = disabledColours.includes(colour) ? " disabled" : ""
        const el = createElement(
            `<div class="colour${disabled}" style="background-color: ${colour};"></div>`
        )
        el.addEventListener("click", () => colourClick(clientColour, colour))
        colours.appendChild(el)
    }
}

function positionColoursBox(clientColour) {
    const offsets = clientColour.getBoundingClientRect();
    colours.style.top = offsets.top + offsets.height + "px"
    colours.style.left = offsets.left + "px"
}

function toggleColours() {
    if (coloursDisplayed) {
        coloursDisplayed = false
        colours.style.display = "none"
    }
    else {
        coloursDisplayed = true
        colours.style.display = "flex"
    }
}

function colourClick(colourDiv, colour) {
    if (disabledColours.includes(colour)) return;
    toggleColours()

    if (colourIndex >= 0) {
        disabledColours.splice(disabledColours.indexOf(colours[colourIndex]), 1)
    }
    disabledColours.push(colour)
    renderColours()

    colourIndex = colourList.indexOf(colour)

    colourDiv.style.backgroundColor = colour

    game.players[game.clientIndex].faction.colour = colour
    saveGame()
    socket.emit("editPlayer", game.players[game.clientIndex])
}

function editPlayer(player) {
    if (player.index === game.clientIndex) return;

    players.children.item(player.index).innerHTML = generatePlayerHtml(player)
    if (game.players[player.index].faction.colour !== player.faction.colour) {
        disabledColours.splice(disabledColours.indexOf(game.players[player.index].faction.colour), 1)
        disabledColours.push(player.faction.colour)
        renderColours()
    }
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

function createElement(html) {
    return dom.parseFromString(html, 'text/html').activeElement.children.item(0)
}