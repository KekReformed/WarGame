import { client } from ".."
import City from "../City"
import { p } from "../sketch"
import { Sprite } from "../Sprite"
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
        this.sprite = new Sprite(depotData.positionX, depotData.positionY, 20, 20) // "userData" is supposed to be at the end of this but like what the fuck is that ?
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

        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]

            //Oh noes! there is an enemy inside of me, now im gonna be captured!
            if (/* this.sprite.overlap(unit.sprite) && */ this.faction !== unit.faction && unit.sprite.velocity.x === 0 && unit.sprite.velocity.y === 0 && !this.inCity) {
                this.faction = unit.faction
            }
        }

        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255,255,255)
        p.noStroke()
        p.text(this.faction,this.sprite.position.x,this.sprite.position.y-15)
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