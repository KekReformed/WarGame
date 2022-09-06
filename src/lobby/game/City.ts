import { client, unitTypes } from "."
import { p } from "./sketch"
import { Sprite } from "./Sprite"
import Infantry from "./units/Infantry"
import Unit from "./units/Unit"
import { worldToScreen } from "./Util"

class City {
    faction: string
    cityName: string
    positionX: number
    positionY: number
    value: number

    sprite: Sprite
    defenders: number

    constructor(faction: string, cityName: string, positionX: number, positionY: number, value: number) {

        this.faction = faction
        this.cityName = cityName
        this.positionX = positionX
        this.positionY = positionY
        this.value = value
        this.sprite = new Sprite(positionX, positionY, 80, 80)
        this.sprite.color = `rgb(0,50,255)`
        client.globalCities.push(this)
    }

    update() {
        this.defenders = 0
        if (this.sprite.collisions.length != 0) {

            for (const i in this.sprite.collisions) {
                if (this.sprite.collisions[i].userData instanceof Unit) {
                    let unit: Unit = this.sprite.collisions[i].userData

                    if (unit.faction === this.faction && unit.is<Infantry>("infantry") && !unit.inCity) {
                        this.defenders += 1
                        unit.inCity = true
                        unit.strengthModifier += 1
                    }
                }
            }

            for (const i in this.sprite.collisions) {
                if (this.sprite.collisions[i].userData instanceof Unit) {
                    let unit: Unit = this.sprite.collisions[i].userData

                    //Oh noes! there is an enemy inside of me, now im gonna be captured!
                    if (this.faction !== unit.faction && unit.sprite.velocity.x === 0 && unit.sprite.velocity.y === 0 && this.defenders === 0 && unit.strength > 0 && unit.type === "infantry") {
                        this.faction = unit.faction
                    }
                }
            }
        }

        let pos = worldToScreen(this.sprite.position.x, this.sprite.position.y)
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.noStroke()
        p.text(`${this.cityName}: £${this.value}B/yr`, pos.x, pos.y)
        p.text(`Owned by: ${this.faction}`, pos.x, pos.y + 10)
    }
}
export default City