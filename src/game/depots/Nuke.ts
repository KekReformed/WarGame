import { Vector } from "p5"
import { game } from "../../lobby"
import { p } from "../sketch"
import { Sprite } from "../Sprite"
import { worldToScreen } from "../Util"

const nukeSpeed = 1
const explosionRadius = 100
const bufferDistance = 3

class Nuke {
    sprite: Sprite
    target: Vector

    constructor(posX: number, posY: number, target: Vector) {
        this.sprite = new Sprite(posX, posY, 10, 10)
        this.sprite.color = `RGB(255,0,0)`
        let mousePos = worldToScreen(p.mouseX, p.mouseY)
        let vector = p.createVector(target.x - this.sprite.position.x, target.y - this.sprite.position.y)
        vector.normalize()
        vector.mult(nukeSpeed)

        // Multiply the vector by deltatime so that it isn't tied to frame rate
        vector.mult(p.deltaTime * 0.1)
        this.sprite.setVelocity(vector.x, vector.y)
        this.target = target
    }

    update(){
        if (this.sprite.position.dist(this.target) < bufferDistance) {

            for (const i in game.units) {
                let unit = game.units[Number(i)]

                if(unit.sprite.position.dist(this.sprite.position) <= explosionRadius) {
                    unit.strength = 0
                }
            }

            this.sprite.remove()
        }
    }
}

export default Nuke