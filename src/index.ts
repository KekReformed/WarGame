import Armour from "./units/Armour";
import Client from "./client";
import Fighter from "./units/Fighter";
import Infantry from "./units/Infantry";
import { p } from "./sketch";
import { AnyUnit } from "./units/Unit";

let timeHeld = 0

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

export function longClick(mouseButton: any) {
    // can't type - p5.play.js
    // timeHeld = mouseDown(mouseButton) ? timeHeld + p.deltaTime : 0

    // if (timeHeld > 800) {
    //     timeHeld = 0
    //     return true
    // }
    // else {
    //     return false
    // }
}

document.body.oncontextmenu = (e) => {
    e.preventDefault();
}