import { socket } from "../shared/api";
import Game from "./api/Game";
import { game } from "./lobby";

const inputs: {[setting: string]: HTMLInputElement} = {}

export default () => {
    const collection = document.getElementsByClassName("switch");
    let switches: HTMLLabelElement[] = []
    for (let i in collection) switches[i] = collection[i] as HTMLLabelElement
    
    for (const s of switches) {
        const checkbox = s.children.item(0) as HTMLInputElement
        inputs[s.id] = checkbox
        if (game[s.id as keyof Game]) checkbox.checked = true

        if (game.client.index === 0) 
            s.addEventListener("click", e => toggleBooleanSetting(s.id as keyof Game))
        else s.children.item(1).classList.add("notOwner")
    } 
}

function toggleBooleanSetting(setting: keyof Game) {
    inputs[setting].checked = !inputs[setting].checked
    const value = !game[setting]
    // @ts-ignore
    game[setting] = value
    if (game.client.index === 0) socket.emit("editSettings", { [setting]: value })
    game.save()
}

socket.on('settingsEdit', (settings: Partial<Game>) => {
    if (game.client.index === 0) return
    for (let setting in settings) {
        if (typeof settings[setting as keyof Game] === "boolean") toggleBooleanSetting(setting as keyof Game)
    }
})