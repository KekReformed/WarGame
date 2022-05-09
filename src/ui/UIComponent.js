import { client } from ".."

class UIComponent {

    constructor(posX, posY, width, height, colour, hidden) {
        this.posX = posX - width / 2
        this.posY = posY - height / 2
        this.width = width
        this.height = height
        this.colour = colour
        this.hidden = hidden
        client.globalUIComponents.push(this)
    }

    hide() {
        this.hidden = true
    }

    mouseOver() {
        return mouseX > this.posX && mouseX < this.posX + this.width && mouseY > this.posY && mouseY < this.posY + this.height
    }

    unhide() {
        this.hidden = false
    }
}

export default UIComponent