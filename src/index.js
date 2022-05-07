import Client from "./client";

export const client = new Client("UK", 0, "SexyLad")

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.body.oncontextmenu = (e) => {
    e.preventDefault();
}
