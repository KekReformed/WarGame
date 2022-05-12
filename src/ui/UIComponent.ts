import { Color } from "p5"
import { client } from ".."
import { p } from "../sketch"
import Button from "./Button"
import PanelUI from "./PanelUI"

export type AnyUIComponent = Button | PanelUI

class UIComponent {
    posX: number
    posY: number
    width: number
    height: number
    colour: Color
    hidden: boolean

    constructor(posX: number, posY: number, width: number, height: number, colour: Color, hidden: boolean) {
        this.posX = posX - width / 2
        this.posY = posY - height / 2
        this.width = width
        this.height = height
        this.colour = colour
        this.hidden = hidden
        // @ts-ignore
        client.globalUIComponents.push(this)
    }

    hide() {
        this.hidden = true
    }

    mouseOver() {
        return p.mouseX > this.posX && p.mouseX < this.posX + this.width && p.mouseY > this.posY && p.mouseY < this.posY + this.height
    }

    unhide() {
        this.hidden = false
    }

    update() {
        
    }
}

export default UIComponent