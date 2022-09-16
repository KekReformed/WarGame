import Battle from "./Battle"
import City from "./City"
import { AnyDepot } from "./depots/Depot"
import { AnyUIComponent } from "./ui/UIComponent"
import { AnyUnit } from "./units/Unit"

class Client {
    day: number

    globalUnits: AnyUnit[]
    globalBattles: Battle[]
    globalCities: City[]
    globalDepots: AnyDepot[]
    globalUIComponents: AnyUIComponent[]

    constructor(faction: string, money: number, name: string, day: number) {
        this.day = day

        this.globalUnits = []
        this.globalBattles = []
        this.globalCities = []
        this.globalDepots = []
        this.globalUIComponents = []
    }
}
export default Client