import { Color } from "p5"
import { client } from ".."
import { p } from "../sketch"
import { screenToWorld } from "../Util"
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
        let temp = screenToWorld(p.mouseX, p.mouseY);
        return temp.x > this.posX && temp.x < this.posX + this.width && temp.y > this.posY && temp.y < this.posY + this.height
    }

    unhide() {
        this.hidden = false
    }

    update() {
        
    }
}

export default UIComponent