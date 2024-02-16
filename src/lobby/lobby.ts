import { request, socket } from "../shared/api";
import { createElement } from "../shared/modules";
import Client from "./api/Client";
import Game, { GamePhase } from "./api/Game";
import Player from "./api/Player";
import settings from "./settings";
import renderStart, { toggleReadyStatus } from "./start";
import '../shared/socketStatus'

const lobby = document.getElementById('lobby')
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

export let game: Game;
(async () => {
  if (localStorage.game) {
    game = new Game(JSON.parse(localStorage.game))
  }
  else {
    const res = await request("GET", "/game", undefined, { authorization: secret }).catch(e => {
      title.innerHTML = `<p>Failed to load a game: ${e.message}</p>`
    })
    if (res) game = new Game(res.body)
  }

  if (game) {
    const titleString = `${game.players[0].name}'s Game`
    document.title = titleString + " | Wargame"
    title.innerHTML = `<p>${titleString}</p>`

    game.playersReady = 0
    for (const i in game.players) {
      const player = game.players[i]
      const isClient = parseInt(i) === game.clientIndex

      isClient
        ? game.players[i] = new Client(player)
        : game.players[i] = new Player(player)

      if (player.faction?.colour) disabledColours.push(player.faction.colour)
      if (player.ready) game.playersReady++
      addPlayer(player, isClient, true)
    }

    renderStart()

    // Generate colour select box
    renderColours()

    positionColoursBox(clientColour)
    window.onresize = () => positionColoursBox(clientColour)

    // Initialise Settings
    settings()

    game.save()

    // Add lobby if game is not started
    if (game.phase === GamePhase.lobby) {
      lobby.style.display = 'block'
    }
  }
})()

const leaveBtn = document.getElementById("leave")
leaveBtn.addEventListener("click", async e => {
  await request("POST", "/game/leave", undefined, { authorization: secret });
  localStorage.clear()
  location.pathname = ""
})

// TODO: move this into the Game class
// the "player" here isn't an instance of a class (yet) and won't have methods
function addPlayer(player: Player, client = false, initialisation = false) {
  if (!initialisation) {
    game.players.push(new Player(player))
    game.save()
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

  if (player.index === game.client.index) {
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
    game.client.faction.name = input.value
    game.save()
    socket.emit("editPlayer", game.client)
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

  game.client.faction.colour = colour
  game.save()
  socket.emit("editPlayer", game.client)
}

// TODO: move this into the Game class
// the "player" here isn't an instance of a class (yet) and won't have methods
function editPlayer(player: Player) {
  const currentPlayer = game.players[player.index]
  if (currentPlayer.ready !== player.ready) toggleReadyStatus(currentPlayer)

  // todo: get rid of this if and edit current player if socket request received to do so, stop local caching!!!
  if (player.index !== game.client.index) {
    if (currentPlayer.faction.colour !== player.faction.colour) {
      disabledColours.splice(disabledColours.indexOf(currentPlayer.faction.colour), 1)
      disabledColours.push(player.faction.colour)
      renderColours()
    }
  }
  renderPlayerHtml(player)
  game.players[player.index] = player
  game.save()
  renderStart()
}

// TODO: move this into the Game class
// the "player" here isn't an instance of a class (yet) and won't have methods
function removePlayer(index: number) {
  toggleReadyStatus(game.players[index])
  game.players.splice(index, 1)
  players.children.item(index).remove()
  game.save()
  renderStart()
}

function phaseEdit(phase: GamePhase) {
  if (phase === 1) {
    // Game start, remove lobby
    lobby.style.display = 'none'
  }
  game.phase = phase
  game.save()
}

socket.on('playerJoin', addPlayer)
socket.on('playerEdit', editPlayer)
socket.on('playerLeave', removePlayer)
socket.on('phaseEdit', phaseEdit)
socket.on('exception', msg => console.error(`Socket request rejected: ${msg}`))
