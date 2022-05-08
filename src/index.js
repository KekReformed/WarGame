import Armour from "./Armour";
import Client from "./client";
import Infantry from "./Infantry";

export const client = new Client("UK", 0, "SexyLad")
export const unitTypes = {
    "infantry" : Infantry,
    "armour" : Armour
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.body.oncontextmenu = (e) => {
    e.preventDefault();
}
