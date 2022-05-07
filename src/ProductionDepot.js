import { client, randomInt } from ".";
import Depot from "./Depot";
import Unit from "./Unit";

class ProductionDepot extends Depot {
    
    constructor(depotData) {
        super(depotData)

        this.unitType = depotData.unitType
    }


    update (unitList) {
        super.update(unitList)

        if (this.selected) {

            if (keyWentDown("1") && client.money >= 1000) {

                let newUnitX = this.sprite.position.x + randomInt(-50,50)
                let newUnitY = this.sprite.position.y + randomInt(-50,50)
                
                console.log(newUnitX,newUnitY)
                new Unit(({
                    faction: this.faction,
                    height: 50,
                    width: 50,
                    h: 0,
                    s: 100,
                    l: 20,
                    positionX: newUnitX,
                    positionY: newUnitY,
                    unitList,
                    strength: 100
                }))

                client.money -= 1000
            }
            
        }
    }
}

export default ProductionDepot