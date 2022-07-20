import './agar.js'
import { createElement } from './shared/api.ts'

const main = document.getElementById("main")
const backBtns = document.getElementsByClassName("back")
const pages = document.getElementsByClassName("page")

// Back button functionality
for (let btn of backBtns) {
    btn.addEventListener("click", e => {
        main.style.display = "block"
        for (let page of pages) {
            page.style.display = "none"
        }
    })
}

const buttons = document.getElementById("buttons")
if (localStorage.game) {
    const game = JSON.parse(localStorage.game)
    buttons.prepend(createElement(`<div class="button" id="current-game">You're already in a game! Click here to reconnect.<br><span>${game.players[0].name}'s game<br>${game.players.length} players</span></div>`))

    document.getElementById("current-game").addEventListener("click", e => location.pathname = "/game/")
}

export async function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

import './createGame.js'