import { Vector } from "p5";
import { client } from "..";
import { longClick, p } from "../sketch";
import Button from "../ui/Button";
import PanelUI from "../ui/PanelUI";
import { specificScaleOfRadius, worldToScreen } from "../Util";
import Nuke from "./Nuke";
import ProductionDepot from "./ProductionDepot";

const range = 2000
const explosionRadius = 100


class NukeSilo extends ProductionDepot {
    loaded: boolean
    button: Button
    panel: PanelUI
    target: Vector
    nuke: Nuke

    constructor(depotData: { [k: string]: any }) {
        super(depotData)
        this.loaded = false

        this.button = new Button(p.color(50, 50, 50, 80), 0, 0, 80, 50, "Build Nuke \n Cost: 6B", true, () => {
            if (client.money >= 6000 && !this.loaded) {
                this.load()
                client.money -= 6000
            }
        })

        this.panel = new PanelUI(p.color(25, 25, 25, 80), this.sprite.position.x + 60, this.sprite.position.y - 75, 100, 60, true, [this.button])
    }

    update() {
        super.update()

        if (this.selected && this.loaded) {

            //Draw the range from the nuke silo
            p.noFill()
            p.stroke(255, 0, 0)
            let pos = worldToScreen(this.sprite.position.x, this.sprite.position.y)
            p.strokeWeight(2)
            let r = specificScaleOfRadius(range)
            p.circle(pos.x, pos.y, r)

            //draw the targeting reticle
            let mousePos = worldToScreen(p.mouseX, p.mouseY)
            r = specificScaleOfRadius(explosionRadius)
            p.circle(mousePos.x, mousePos.y, r)

            //fire da nuke
            if (longClick(p.RIGHT)) {
                this.unload()
                this.deselect()
                let target = p.createVector(mousePos.x, mousePos.y)
                this.nuke = new Nuke(pos.x, pos.y, target)
            }
        }

        if (this.nuke) this.nuke.update();
    }

    load() {
        this.loaded = true
        this.sprite.color = "RGB(180,0,0)"
    }

    unload() {
        this.loaded = false
        this.sprite.color = "RGB(200,200,200)"
    }

    select() {
        super.select()
        if (this.loaded) this.panel.hide();
    }
    
    enable() {
        super.enable()
        this.load()
    }
}

export default NukeSilo