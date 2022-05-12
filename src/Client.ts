import Battle from "./Battle"
import City from "./City"
import Depot, { AnyDepot } from "./depots/Depot"
import UIComponent from "./ui/UIComponent"
import Unit from "./units/Unit"

class Client {  
    faction: string
    money: number
    name: string

    globalUnits: Unit[]
    globalBattles: Battle[]
    globalCities: City[]
    globalDepots: AnyDepot[]
    globalUIComponents: UIComponent[]

    constructor(faction: string, money: number, name: string) {
        this.faction = faction
        this.money = money
        this.name = name

        this.globalUnits = []
        this.globalBattles = []
        this.globalCities = []
        this.globalDepots = []
        this.globalUIComponents = []
    }
}   
export default Client