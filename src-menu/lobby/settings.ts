import { socket } from "../shared/api";
import { Game, game } from "./lobby";

export default () => {
    const collection = document.getElementsByClassName("switch");
    let switches: HTMLLabelElement[] = []
    for (let i in collection) switches[i] = collection[i] as HTMLLabelElement
    
    for (const s of switches) {
        const checkbox = s.children.item(0) as HTMLInputElement
        if (game[s.id as keyof Game]) checkbox.checked = true

        s.addEventListener("click", e => {
            toggleBooleanSetting(s.id as keyof Game, checkbox)
        })
    } 
}

function toggleBooleanSetting(setting: keyof Game, checkbox?: HTMLInputElement) {
    if (checkbox) checkbox.checked = !checkbox.checked
    const value = !game[setting]
    // @ts-ignore
    game[setting] = value
    socket.emit("gameEdit", { [setting]: value })
    console.log(game)
}