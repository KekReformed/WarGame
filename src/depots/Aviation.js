import ProductionDepot from "../depots/ProductionDepot";
import { client, randomInt } from "..";
import Button from "../ui/Button";
import PanelUI from "../ui/PanelUI";
import Fighter from "../units/Fighter";


class Aviation extends ProductionDepot {
    constructor(depotData) {
        super(depotData)
        this.type = "barracks"

        this.fighterButton = new Button(color(50, 50, 50, 80), 0, 0, 80, 50, "Create fighter \n Cost: 2.5B", true, () => {
            if (client.money >= 2500) {
                let newUnitX = this.sprite.position.x + randomInt(-50, 50)
                let newUnitY = this.sprite.position.y + randomInt(-50, 50)

                new Fighter({
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

                client.money -= 2500
            }
        })

        this.panel = new PanelUI(color(25, 25, 25, 80), this.sprite.position.x + 60, this.sprite.position.y - 50, 100, 60, true, [this.fighterButton])
    }
}

export default Aviation