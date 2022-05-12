import { Color } from "p5"
import { p } from "../sketch"
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
        p.rect(this.posX, this.posY, this.width, this.height)

        p.textSize(this.width / 7)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.text(this.label, this.posX + this.width / 2, this.posY + this.height / 2)


        //Check if the mouse is inside me
        if (this.mouseOver() /* && mouseWentDown(LEFT) */) {
            this.buttonFunction()
        }
    }
}

export default Button