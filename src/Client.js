class Client {  

    constructor(faction, money, username) {
        this.faction = faction
        this.money = money
        this.username = username

        this.globalUnits = []
        this.globalBattles = []
        this.globalCities = []
        this.globalDepots = []
        this.globalUIComponents = []
    }
}   

export default Client