import { client, randomInt } from ".";
import Armour from "./Armour";
import Button from "./Button";
import Depot from "./Depot";
import Infantry from "./Infantry";
import PanelUI from "./PanelUI";

class ProductionDepot extends Depot {

    constructor(depotData) {
        super(depotData)

        this.unitType = depotData.unitType

        this.infantryButton = new Button(color(50, 50, 50, 80), 0, -30, 80, 50, "Create infantry \n Cost: 1B", true, () => {
            if (client.money >= 1000) {
                let newUnitX = this.sprite.position.x + randomInt(-50, 50)
                let newUnitY = this.sprite.position.y + randomInt(-50, 50)

                new Infantry({
                    faction: this.faction,
                    height: 50,
                    width: 50,
                    h: 0,
                    s: 100,
                    l: 20,
                    positionX: newUnitX,
                    positionY: newUnitY,
                    strength: 100
                })

                client.money -= 1000
            }
        })

        this.tankButton = new Button(color(50, 50, 50, 80), 0, 30, 80, 50, "Create Armour \n Cost: 1.2B", true, () => {
            if (client.money >= 1200) {
                let newUnitX = this.sprite.position.x + randomInt(-50, 50)
                let newUnitY = this.sprite.position.y + randomInt(-50, 50)

                new Armour({
                    faction: this.faction,
                    height: 50,
                    width: 50,
                    h: 0,
                    s: 100,
                    l: 20,
                    positionX: newUnitX,
                    positionY: newUnitY,
                    strength: 100
                })

                client.money -= 1200
            }
        })

        this.panel = new PanelUI(color(25, 25, 25, 80), this.sprite.position.x + 60, this.sprite.position.y - 75, 100, 120, true, [this.infantryButton, this.tankButton])
    }

    select() {
        super.select()
        this.panel.unhide()
    }

    deselect() {
        //If the mouse is not inside of the panel then deselect me and hide me        
        if (!this.panel.mouseOver()) {
            super.deselect()
            this.panel.hide()
        }
    }
}

export default ProductionDepot