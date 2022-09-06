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

// Join current game button
const buttons = document.getElementById("buttons")
if (localStorage.game) {
    const game = JSON.parse(localStorage.game)
    buttons.prepend(createElement(`<div class="button" id="current-game">You're already in a game! Click here to reconnect.<br><span>${game.players[0].name}'s game<br>${game.players.length} players</span></div>`))

    document.getElementById("current-game").addEventListener("click", e => location.pathname = "/game/")
}

// Mobile/Tablet users message
if ("ontouchstart" in window) {
    buttons.innerHTML = "It appears you're viewing this screen on a touch screen device. Unfortunately Wargame can't be played on a touch screen device as we've designed the experience explicitly for keyboard and mouse. This is not likely to change.<br><br>The buttons are still accessible below as some devices support keyboard, mouse and touchscreen. But if you are on a phone/tablet, nothing will work for you." + buttons.innerHTML
}

export async function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

import './createGame.js'