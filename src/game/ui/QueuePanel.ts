import { Color } from "p5";
import PanelUI from "./PanelUI";
import UIComponent from "./UIComponent";
import { worldToScreen } from "../Util";
import { p } from "../sketch";
import { Production } from "../depots/ProductionDepot";



class QueuePanel extends PanelUI {
    colour: Color
    posX: number
    posY: number
    width: number
    height: number
    hidden: boolean
    UIComponents: UIComponent[]
    queue: Production[]
    maxQueue: number
    squareSize: number
    squareSpacing: number

    constructor(colour: Color, posX: number, posY: number, width: number, height: number, hidden: boolean, UIComponents: UIComponent[], queue: Production[], maxQueue: number) {
        super(colour, posX, posY, width, height, hidden, UIComponents)
        this.queue = queue
        this.maxQueue = maxQueue
        this.squareSize = 10
        this.squareSpacing = 15
    }

    update() {
        super.update()
        if (this.hidden) return

        let spaceCount = 0
        let rightShift = 0
        for (const i in this.queue) {
            if (spaceCount === this.maxQueue / 2) {
                spaceCount = 0
                rightShift = this.squareSpacing
            }
            p.fill("255")
            p.noStroke()
            p.rectMode("corners")
            let temp = worldToScreen(this.posX - 15, this.posY)
            p.rect(temp.x + this.width - this.squareSize + rightShift, temp.y + this.squareSpacing * spaceCount, temp.x + this.width + rightShift, temp.y + this.squareSize + this.squareSpacing * spaceCount)
            p.textSize(12)
            p.textAlign(p.CENTER)
            p.fill(0, 100, 0)
            p.textStyle("bold")
            p.noStroke()
            p.text(`${this.queue[i].unitData.type[0].toUpperCase()}`, temp.x + this.width - this.squareSize / 2 + rightShift, temp.y + this.squareSize + this.squareSpacing * spaceCount)
            p.textStyle("normal")
            spaceCount += 1
        }
    }
}

export default QueuePanel