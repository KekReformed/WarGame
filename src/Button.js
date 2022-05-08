import UIComponent from "./UIComponent"

class Button extends UIComponent {

    constructor(colour, posX, posY, width, height, label, hidden, buttonFunction) {
        super(posX, posY, width, height, colour, hidden)
        this.buttonFunction = buttonFunction
        this.label = label
    }

    update() {
        if (this.hidden) return

        fill(this.colour)
        noStroke()
        rect(this.posX, this.posY, this.width, this.height)

        textSize(this.width/7)
        textAlign(CENTER)
        fill(255,255,255)
        text(this.label, this.posX  + this.width/2, this.posY + this.height/2)


        //Check if the mouse is inside me
        if (this.mouseOver() && mouseWentDown(LEFT)) {
            this.buttonFunction()
        }
    }
}

export default Button