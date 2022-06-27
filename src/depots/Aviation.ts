import ProductionDepot, { Production } from "./ProductionDepot";
import { client, randomInt } from "..";
import Button from "../ui/Button";
import PanelUI from "../ui/PanelUI";
import Fighter from "../units/Fighter";
import { p } from "../sketch";


class Aviation extends ProductionDepot {
    fighterButton: Button

    constructor(depotData: { [k: string]: any }) {
        super(depotData)
        this.type = "aviation"

        this.fighterButton = new Button(p.color(50, 50, 50, 80), 0, 0, 80, 50, "Create fighter \n Cost: 2.5B", true, () => {
            if (client.money >= 2500) {
                let newUnitX = this.sprite.position.x + randomInt(-50, 50)
                let newUnitY = this.sprite.position.y + randomInt(-50, 50)

                let production:Production = {
                    unitData: {
                        faction: this.faction,
                        height: 50,
                        width: 50,
                        positionX: newUnitX,
                        positionY: newUnitY,
                        strength: 100,
                        type: "fighter jet"
                    },
                    productionTime: 5
                }

                this.enqueue(production)

                client.money -= 2500
            }
        })

        this.panel = new PanelUI(p.color(25, 25, 25, 80), this.sprite.position.x + 60, this.sprite.position.y - 50, 100, 60, true, [this.fighterButton])
    }
}

export default Aviation