import { createElement, request, socket } from "../shared/api";
import settings from "./settings";
import renderStart, { toggleReadyStatus } from "./start";

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
let disabledColours: string[] = [];
let colourIndex: number;
let clientColour: HTMLDivElement;

const secret = localStorage.secret;

export enum GamePhase {
    "lobby",
    "playing"
}

export interface Game {
    id: string
    players: Player[]
    clientIndex: number
    public?: string
    phase: GamePhase

    playersReady: number
}

export interface Player {
    name: string
    faction: {
        name: string
        colour: string
    }
    ready?: boolean
    index: number
}

export let game: Game;
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
        
        game.playersReady = 0
        for (const i in game.players) {
            game.players[i].index = parseInt(i)
            const player = game.players[i]
            if (player.faction?.colour) disabledColours.push(player.faction.colour)
            if (player.ready) game.playersReady ++
            addPlayer(player, parseInt(i) === game.clientIndex, true)
        }
        
        renderStart()
        
        // Generate colour select box
        renderColours()
        
        positionColoursBox(clientColour)
        window.onresize = () => positionColoursBox(clientColour)

        // Initialise Settings
        settings()

        saveGame()
    }
})()

const leaveBtn = document.getElementById("leave")
leaveBtn.addEventListener("click", async e => {
    await request("POST", "/game/leave", undefined, {authorization: secret});
    localStorage.clear()
    location.pathname = ""
})

function addPlayer(player: Player, client=false, initialisation=false) {
    if (!initialisation) {
        player.index = game.players.length
        game.players.push(player)
        saveGame()
    }

    const element = createElement(`<div class="player" ${client ? 'id="client"' : ''}></div>`)
    players.append(element)
    renderPlayerHtml(player)
    renderStart()
}

/** Creates and appends a new render of the player HTML, given that there's already a player div there.
 *  If this player is the client, the click events are re added to the new elements too. */
function renderPlayerHtml(player: Player) {
    const playerElement = players.children.item(player.index)
    const input = `<input class="input" type="text" style="display: none" maxLength="30"/>`

    const html = `
        <p class="${player.ready ? 'ready' : ''}${player.index === 0 ? ' owner' : ''}">${player.name}</p>
        <div class="faction">
            <p class="${player.faction.name ? "" : "no-faction"}">${player.faction.name || "No faction selected"}</p>
            ${input}
            ${player.faction.colour
                ? `<div class="player-colour" style="background-color: ${player.faction.colour}"></div>`
                : `<div class="player-colour no-faction"></div>`
            }
        </div>`
    playerElement.innerHTML = html

    if (player.index === game.clientIndex) {
        colourIndex = colourList.indexOf(player.faction.colour)

        const faction = playerElement.children.item(1)
        const [factionName, factionInput, factionColour]: [HTMLDivElement, HTMLInputElement, HTMLDivElement] = faction.children as any
        clientColour = factionColour

        factionName.addEventListener("click", e => changeToInput(factionName, factionInput))

        factionInput.style.width = factionInput.value.length + 3 + "ch"
        factionInput.addEventListener("input", e => factionInput.style.width = factionInput.value.length + 5 + "ch")
        factionInput.addEventListener("blur", e => changeToText(factionName, factionInput))
        factionInput.addEventListener("keydown", e => e.key === "Enter" && changeToText(factionName, factionInput))

        factionColour.addEventListener("click", e => toggleColours())
    }
}

function changeToInput(text: HTMLDivElement, input: HTMLInputElement) {
    text.style.display = "none"
    input.style.display = "block"
    input.value = text.innerHTML
    input.select()
}

function changeToText(text: HTMLDivElement, input: HTMLInputElement) {
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
    colours.innerHTML = ""
    if (colourIndex >= 0) {
        const deselect = createElement("<p class='deselect'>Deselect Colour</p>")
        deselect.addEventListener("click", () => colourClick(clientColour, null))
        colours.appendChild(deselect)
    }

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

function positionColoursBox(clientColour: HTMLDivElement) {
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

function colourClick(colourDiv: HTMLDivElement, colour: string) {
    toggleColours()

    if (colourIndex >= 0) {
        disabledColours.splice(disabledColours.indexOf(colourList[colourIndex]), 1)
    }
    if (colour) {
        disabledColours.push(colour)
        colourDiv.style.backgroundColor = colour
        colourDiv.className = "player-colour"
    }
    else {
        colourDiv.className += " no-faction"
    }
    colourIndex = colourList.indexOf(colour)
    renderColours()

    game.players[game.clientIndex].faction.colour = colour
    saveGame()
    socket.emit("editPlayer", game.players[game.clientIndex])
}

function editPlayer(player: Player) {
    const currentPlayer = game.players[player.index]
    if (currentPlayer.ready !== player.ready) toggleReadyStatus(currentPlayer)

    if (player.index !== game.clientIndex) {
        if (currentPlayer.faction.colour !== player.faction.colour) {
            disabledColours.splice(disabledColours.indexOf(currentPlayer.faction.colour), 1)
            disabledColours.push(player.faction.colour)
            renderColours()
        }
    }
    renderPlayerHtml(player)
    game.players[player.index] = player
    saveGame()
    renderStart()
}

function removePlayer(index: number) {
    toggleReadyStatus(game.players[index])
    game.players.splice(index, 1)
    players.children.item(index).remove()
    saveGame()
    renderStart()
}

export function saveGame() {
    localStorage.game = JSON.stringify(game)
}

socket.on('playerJoin', addPlayer)
socket.on('playerEdit', editPlayer)
socket.on('playerLeave', removePlayer)
socket.on('exception', msg => console.error(`Socket request rejected: ${msg}`))