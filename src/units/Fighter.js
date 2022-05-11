import { client } from "..";
import Unit from "./Unit";

class Fighter extends Unit {
    constructor(unitData) {
        super(unitData)
        this.type = "fighter jet"
        this.terrainType = "air"
        this.speed = 5
        this.rangeModifier = 1
    }

    update() {
        super.update()
        let dist = 0
        let lowestDist = Infinity

        //Find the closest airstrip
        for (const i in client.globalDepots) {
            let depot = client.globalDepots[i]

            dist = depot.sprite.position.dist(this.sprite.position)

            if (depot.type === "airstrip" && dist <= lowestDist && depot.faction === this.faction) {
                this.closestAirstrip = depot
                lowestDist = dist
            }
        }

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

    goTo(destination, speed = 1) {
        super.goTo(destination, speed)
        let dist = 0
        let lowestDist = Infinity

        for (const i in client.globalDepots) {
            let depot = client.globalDepots[i]

            dist = depot.sprite.position.dist(this.goToPoint)

            if (depot.type === "airstrip" && dist <= lowestDist) {
                this.goToClosestAirstrip = depot
                lowestDist = dist
            }
        }
    }
}

export default Fighter