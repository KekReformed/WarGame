import { Color } from "p5"
import { mouseWentDown, p } from "../sketch"
import { screenToWorld, worldToScreen } from "../Util"
import UIComponent from "./UIComponent"

class Button extends UIComponent {
    colour: Color
    posX: number
    posY: number
    width: number
    height: number
    label: string
    hidden: boolean

    buttonFunction: () => void

    constructor(colour: Color, posX: number, posY: number, width: number, height: number, label: string, hidden: boolean, buttonFunction: () => void) {
        super(posX, posY, width, height, colour, hidden)
        this.buttonFunction = buttonFunction
        this.label = label
    }

    update() {
        if (this.hidden) return

        p.fill(this.colour)
        p.noStroke()
        let temp = worldToScreen(this.posX, this.posY)
        p.rect(temp.x, temp.y, temp.x + this.width, temp.y + this.height)

        p.textSize(this.width / 7)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.text(this.label, temp.x + this.width / 2, temp.y + this.height / 2)


        //Check if the mouse is inside me
        if (this.mouseOver() && mouseWentDown(p.LEFT)) {
            this.buttonFunction()
        }
    }
}

export default Button