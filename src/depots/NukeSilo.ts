import { Color, Vector } from "p5";
import { client } from "..";
import { longClick, p } from "../sketch";
import { Sprite } from "../Sprite";
import Button from "../ui/Button";
import PanelUI from "../ui/PanelUI";
import { specificScaleOfRadius, worldToScreen } from "../Util";
import ProductionDepot from "./ProductionDepot";

const range = 2000
const explosionRadius = 100
const nukeSpeed = 1
const bufferDistance = 3


class NukeSilo extends ProductionDepot {
    loaded: boolean
    button: Button
    panel: PanelUI
    target: Vector
    nuke: Sprite

    constructor(depotData: { [k: string]: any }) {
        super(depotData)
        this.loaded = false

        this.button = new Button(p.color(50, 50, 50, 80), 0, 0, 80, 50, "Build Nuke \n Cost: 6B", true, () => {
            if (client.money >= 6000 && !this.loaded) {
                this.loaded = true
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
            let r = specificScaleOfRadius(range)
            p.circle(pos.x, pos.y, r)

            //draw the targeting reticle
            let mousePos = worldToScreen(p.mouseX, p.mouseY)
            r = specificScaleOfRadius(explosionRadius)
            p.circle(mousePos.x, mousePos.y, r)

            //fire da nuke
            if (longClick(p.RIGHT)) {
                this.nuke = new Sprite(pos.x, pos.y, 10, 10)
                this.nuke.color = `RGB(255,0,0)`
                this.loaded = false

                this.target = p.createVector(mousePos.x, mousePos.y)
                let vector = p.createVector(this.target.x - this.sprite.position.x, this.target.y - this.sprite.position.y)
                vector.normalize()
                vector.mult(nukeSpeed)
                // Multiply the vector by deltatime so that it isn't tied to frame rate
                vector.mult(p.deltaTime * 0.1)
                this.nuke.setVelocity(vector.x, vector.y)
            }
        }

        if (this.nuke && this.nuke.position.dist(this.target) < bufferDistance) {

            for (const i in client.globalUnits) {
                let unit = client.globalUnits[Number(i)]

                if(unit.sprite.position.dist(this.nuke.position) <= 100) {
                    unit.strength = 0
                }
            }

            this.nuke.remove()
        }
    }

    select() {
        super.select()
        if (this.loaded) this.panel.hide();
    }
}

export default NukeSilo