import UIComponent from "./UIComponent"

class PanelUI extends UIComponent {

    constructor(colour, posX, posY, width, height, hidden, UIComponents) {
        super(posX, posY, width, height, colour, hidden)

        for (const i in UIComponents) {
            UIComponents[i].posX += this.posX + this.width / 2
            UIComponents[i].posY += this.posY + this.height / 2
        }

        this.UIComponents = UIComponents
    }

    update() {
        if (this.hidden) return

        fill(this.colour)
        noStroke()
        rect(this.posX, this.posY, this.width, this.height)
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