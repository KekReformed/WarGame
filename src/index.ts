import Armour from "./units/Armour";
import Client from "./client";
import Fighter from "./units/Fighter";
import Infantry from "./units/Infantry";
let keysPressed: string[] = []
let keysHeld: string[] = []

export const client = new Client("UK", 0, "SexyLad")

interface UnitTypes {
    [type: string]: any
}

export const unitTypes: UnitTypes = {
    "infantry": Infantry,
    "armour": Armour,
    "fighter jet": Fighter,
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


document.body.oncontextmenu = (e) => {
    e.preventDefault();
}

document.onkeydown = addKey
document.onkeyup = removeKey

function addKey(keyHeld: KeyboardEvent) {
    let keyHeldChar = keyHeld.code.replace("Key","")

    if (!keysPressed.includes(keyHeldChar)) {
        keysPressed.push(keyHeldChar)
    }

    else if(!keysHeld.includes(keyHeldChar)){
        keysHeld.push(keyHeldChar)
        keysPressed.splice(keysPressed.findIndex(element => element === keyHeldChar),1)
    }

    console.log(keysHeld,keysPressed)
}

function removeKey(keyReleased: KeyboardEvent) {
    let keyReleasedChar = keyReleased.code.replace("Key","")
    keysPressed.splice(keysPressed.findIndex(element => element === keyReleasedChar),1)
}



export function keyDown(key: string) {
    return keysPressed.includes(key.toUpperCase())
}

export function keyWentDown(key: string) {
    return keysPressed.includes(key.toUpperCase())
}