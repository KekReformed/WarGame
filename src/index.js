import Armour from "./units/Armour";
import Client from "./client";
import Fighter from "./units/Fighter";
import Infantry from "./units/Infantry";

let timeHeld = 0

export const client = new Client("UK", 0, "SexyLad")
export const unitTypes = {
    "infantry" : Infantry,
    "armour" : Armour,
    "fighter jet" : Fighter,
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function longClick(mouseButton) {
    timeHeld = mouseDown(mouseButton) ? timeHeld + deltaTime : 0

    if (timeHeld > 800) {
        timeHeld = 0
        return true
    }
    else {
        return false
    }
}

document.body.oncontextmenu = (e) => {
    e.preventDefault();
}
