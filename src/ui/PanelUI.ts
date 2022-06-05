import { Color } from "p5"
import { p } from "../sketch"
import { worldToScreen } from "../Util"
import UIComponent from "./UIComponent"

class PanelUI extends UIComponent {
    colour: Color
    posX: number
    posY: number
    width: number
    height: number
    hidden: boolean
    UIComponents: UIComponent[]

    constructor(colour: Color, posX: number, posY: number, width: number, height: number, hidden: boolean, UIComponents: UIComponent[]) {
        super(posX, posY, width, height, colour, hidden)

        for (const i in UIComponents) {
            UIComponents[i].posX += this.posX + this.width / 2
            UIComponents[i].posY += this.posY + this.height / 2
        }

        this.UIComponents = UIComponents
    }

    update() {
        if (this.hidden) return

        p.fill(this.colour)
        p.noStroke()
        p.rectMode("corners")
        let temp = worldToScreen(this.posX, this.posY)
        p.rect(temp.x, temp.y, temp.x + this.width, temp.y + this.height)
    }

    hide() {
        super.hide()

        for (const i in this.UIComponents) {
            this.UIComponents[i].hide()
        }

    }

    unhide() {
        super.unhide()

        for (const i in this.UIComponents) {
            this.UIComponents[i].unhide()
        }

    }
}

export default PanelUI