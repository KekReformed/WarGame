import { Vector } from "p5";
import { client } from "..";
import Airstrip from "../depots/Airstrip";
import Unit, { UnitData } from "./Unit";

class Fighter extends Unit {
    range: number
    goToRange: number
    rangeModifier: number
    closestAirstrip?: Airstrip
    goToClosestAirstrip: Airstrip

    constructor(unitData: {[k: string]: any} & UnitData) {
        super(unitData)
        this.type = "fighter jet"
        this.terrainType = "air"
        this.speed = 5
        this.rangeModifier = 1
    }

    update() {
        super.update()
        let lowestDist = Infinity

        //Find the closest airstrip
        for (const i in client.globalDepots) {
            let depot = client.globalDepots[i]

            let dist = depot.sprite.position.dist(this.sprite.position)

            if (depot.is<Airstrip>("airstrip") && dist <= lowestDist && depot.faction === this.faction) {
                this.closestAirstrip = depot
                lowestDist = dist
            }
        }

        if (!this.closestAirstrip) return
        this.range = this.closestAirstrip.range * this.rangeModifier / 2 
        if (this.goToClosestAirstrip) this.goToRange = this.goToClosestAirstrip.range * this.rangeModifier / 2 

        //If we are out of range of the closest airstrip go to it
        if (this.closestAirstrip.sprite.position.dist(this.sprite.position) - 10 > this.range) {
            this.goTo(this.closestAirstrip.sprite.position, this.speed)
        }
        
        else if (this.closestAirstrip.sprite.position.dist(this.sprite.position) > this.range / 2 && this.goToClosestAirstrip && this.goToClosestAirstrip.sprite.position.dist(this.goToPoint) > this.goToRange) {
            this.sprite.setVelocity(0,0)
        }
    }

    goTo(destination: Vector, speed = 1) {
        super.goTo(destination, speed)
        let dist = 0
        let lowestDist = Infinity

        for (const i in client.globalDepots) {
            let depot = client.globalDepots[i]
            dist = depot.sprite.position.dist(this.goToPoint)

            if (depot.is<Airstrip>("airstrip") && dist <= lowestDist) {
                this.goToClosestAirstrip = depot
                lowestDist = dist
            }
        }
    }
}
export default Fighter