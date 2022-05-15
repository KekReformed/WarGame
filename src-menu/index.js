import './agar.js'

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

export async function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

import './createGame.js'