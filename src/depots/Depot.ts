import { client } from ".."
import City from "../City"
import { p } from "../sketch"
import { Sprite } from "../Sprite"
import Unit from "../units/Unit"
import { worldToScreen } from "../Util"
import Airstrip from "./Airstrip"
import Aviation from "./Aviation"
import Barracks from "./Barracks"

export type AnyDepot = Airstrip | Aviation | Barracks | Depot

class Depot {
    type: string
    faction: string | "None"
    sprite: Sprite
    city: City
    inCity: boolean
    selected: boolean
    
    constructor(depotData: {[k: string]: any}) {
        this.faction = depotData.faction
        this.sprite = new Sprite(depotData.positionX, depotData.positionY, 20, 20, this, 0) // "userData" is supposed to be at the end of this but like what the fuck is that ?
        this.city = depotData.city
        this.selected = false
        this.sprite.color = `rgb(200,200,200)`
        this.inCity = depotData.inCity

        if (this.city) this.inCity = true

        client.globalDepots.push(this)
    }

    is<DepotType>(type: string): this is DepotType {
        return this.type === type
    }

    update() {
        if (this.inCity) this.faction = this.city.faction

        for (const i in this.sprite.collisions) {

            if (this.sprite.collisions[i].userData instanceof Unit) {
                let unit: Unit = this.sprite.collisions[i].userData

                //Oh noes! there is an enemy inside of me, now im gonna be captured!
                if (!this.inCity && this.faction !== unit.faction && unit.sprite.velocity.x === 0 && unit.sprite.velocity.y === 0 && unit.strength > 0 && unit.type === "infantry") {
                    this.faction = unit.faction
                }
            }
        }

        let pos = worldToScreen(this.sprite.position.x,this.sprite.position.y)
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255,255,255)
        p.noStroke()
        p.text(this.faction,pos.x,pos.y-15)
    }

    select() {
        this.selected = true
        this.sprite.color = `rgb(255,255,255)`
    }

    deselect() {
        this.selected = false
        this.sprite.color = `rgb(200,200,200)`
    }
}

export default Depot