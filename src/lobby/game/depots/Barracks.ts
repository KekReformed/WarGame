import ProductionDepot, { Production } from "./ProductionDepot";
import { randomInt } from "..";
import Button from "../ui/Button";
import PanelUI from "../ui/PanelUI";
import { p } from "../sketch";
import { game } from "../../lobby";


class Barracks extends ProductionDepot {
    infantryButton: Button
    tankButton: Button


    constructor(depotData: { [k: string]: any }) {
        super(depotData)
        this.type = "barracks"

        this.infantryButton = new Button(p.color(50, 50, 50, 80), 0, -30, 80, 50, "Create infantry \n Cost: 1B", true, () => {
            if (game.client.money >= 1000) {
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
                        type: "infantry"
                    },
                    productionTime: 3
                }

                this.enqueue(production)

                game.client.money -= 1000
            }
        })

        this.tankButton = new Button(p.color(50, 50, 50, 80), 0, 30, 80, 50, "Create Armour \n Cost: 1.2B", true, () => {
            if (game.client.money >= 1200) {
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
                        type: "armour"
                    },
                    productionTime: 3
                }

                this.enqueue(production)

                game.client.money -= 1200
            }
        })

        this.panel = new PanelUI(p.color(25, 25, 25, 80), this.sprite.position.x + 60, this.sprite.position.y - 75, 100, 120, true, [this.infantryButton, this.tankButton])
    }
}

export default Barracks