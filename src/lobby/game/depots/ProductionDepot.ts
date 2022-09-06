import { client, unitTypes } from "..";
import { p, timeScale } from "../sketch";
import PanelUI from "../ui/PanelUI";
import { UnitData } from "../units/Unit";
import { specificScaleOfRadius, worldToScreen } from "../Util";
import Depot from "./Depot";
import Nuke from "./Nuke";

const radius = 50

export interface Production {
    unitData: UnitData | Nuke
    productionTime: number
}

class ProductionDepot extends Depot {
    panel: PanelUI
    selectable: boolean
    productionFinishTime: number
    increment: number
    arcStart: number
    arcEnd: number
    productionQueue: Production[]

    constructor(depotData: { [k: string]: any }) {
        super(depotData)
        this.selectable = true
        this.increment = 0
        this.arcStart = -p.HALF_PI
        this.arcEnd = p.PI + p.HALF_PI
        this.productionQueue = []
    }

    select() {
        if (!this.selectable) return;

        super.select()
        this.panel.unhide()
    }

    enqueue(production: Production) {
        if (this.productionQueue.length === 0) this.disableFor(production.productionTime)
        this.productionQueue.push(production)
    }

    disableFor(time: number) {
        this.selectable = false
        this.productionFinishTime = client.day + time
        this.increment = 2 * p.PI / time
    }

    enable() {
        this.selectable = true
    }

    deselect() {
        //If the mouse is not inside of the panel then deselect me and hide me        
        if (!this.panel.mouseOver()) {
            super.deselect()
            this.panel.hide()
        }
    }

    forceDeselect() {
        super.deselect()
        this.panel.hide()
    }

    build() {
        //@ts-ignore
        new unitTypes[this.productionQueue[0].unitData.type](this.productionQueue[0].unitData)
    }

    updateArc() {
        let pos = worldToScreen(this.sprite.position.x, this.sprite.position.y)
        let r = specificScaleOfRadius(radius)
        p.noFill()
        p.stroke(255, 0, 0)
        p.strokeWeight(5)
        p.arc(pos.x, pos.y, r, r, this.arcStart, this.arcEnd)

        this.arcStart += (this.increment * p.deltaTime / 1000) * timeScale
    }

    update() {
        if (this.productionQueue.length > 0) {
            if (client.day >= this.productionFinishTime) {
                this.enable()

                this.build()
                this.productionQueue.splice(0, 1)
                if (this.productionQueue.length !== 0) this.disableFor(this.productionQueue[0].productionTime)
            }

            else if (this.productionFinishTime) {   
                this.updateArc()
            }
        }

        super.update()
    }
}

export default ProductionDepot