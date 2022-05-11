class Battle {

    constructor(positionX, positionY, firstUnit, secondUnit) {
        this.positionX = positionX
        this.positionY = positionY
        this.factions = {
            [firstUnit.faction]: {
                units: { [firstUnit.terrainType]: { [firstUnit.type]: firstUnit.effectiveStrength } }
            },
            [secondUnit.faction]: { units: { [secondUnit.terrainType]: { [secondUnit.type]: secondUnit.effectiveStrength } } }
        }

        this.totalStrength = 0
        this.land = 0
        this.air = 0
        this.sprite = createSprite(positionX, positionY, 100, 100)
        this.sprite.depth = -1
        this.sprite.setDefaultCollider()
        this.sprite.shapeColor = `rgb(0,0,255)`
        this.damageInterval = 0.1
        this.timer = 0
        this.factionList = Object.keys(this.factions)

        for (const factionName in this.factions) {
            let faction = this.factions[factionName]
            faction.totalStrength = 0
            faction.land = 0
            faction.air = 0

            for (const unitTerrainType in faction.units) {

                for (const unitType in faction.units[unitTerrainType]) {
                    this[unitTerrainType] += faction.units[unitTerrainType][unitType]
                    faction[unitTerrainType] += faction.units[unitTerrainType][unitType]
                    faction.totalStrength += faction.units[unitTerrainType][unitType]
                    this.totalStrength += faction.units[unitTerrainType][unitType]
                }
            }
        }
    }

    update() {
        this.timer += deltaTime / 1000

        if (this.timer > this.damageInterval) {
            this.winningStrength = 0

            let totalDamage = 0
            let totalAirDamage = 0

            for (const factionName in this.factions) {
                let faction = this.factions[factionName]
                faction.uniqueLandUnits = 0
                faction.uniqueAirUnits = 0

                let damage = Math.min(0.025 * (this.totalStrength - faction.totalStrength), 100)
                let airDamage = Math.min(0.025 * (this.air - faction.air), 100) 

                for (const unitTerrainType in faction.units) {
                    if (unitTerrainType === "land") faction.uniqueLandUnits += 1
                    if (unitTerrainType === "air") faction.uniqueAirUnits += 1
                }

                for (const unitTerrainType in faction.units) {

                    if (unitTerrainType === "land") {
                        for (const unitType in faction.units[unitTerrainType]) {
                            let dividedDamage = damage / faction.uniqueLandUnits

                            faction.units.land[unitType] -= dividedDamage
                            faction.land -= dividedDamage
                            faction.totalStrength -= dividedDamage
                            totalDamage += dividedDamage
                        }
                    }

                    //Air units only take damage from other air units which is calculated in air damage unless they are the only unit in combat
                    if(unitTerrainType === "air") {
                        for (const unitType in faction.units[unitTerrainType]) {
                            let dividedDamage;
                            if (faction.uniqueLandUnits < 1) {
                                dividedDamage = damage / faction.uniqueAirUnits
                                totalDamage += dividedDamage
                            }
                            else {
                                dividedDamage = airDamage / faction.uniqueAirUnits
                                totalAirDamage += dividedDamage
                            }

                            faction.units.air[unitType] -= dividedDamage
                            faction.air -= dividedDamage
                            faction.totalStrength -= dividedDamage
                        }
                    }
                }

                if (faction.totalStrength > this.winningStrength) {
                    this.winningFaction = factionName
                    this.winningStrength = faction.totalStrength
                }
            }

            this.totalStrength -= totalDamage
            this.land -= totalDamage
            this.air -= totalAirDamage
        }

        if (this.timer > this.damageInterval) this.timer -= this.damageInterval;

        //Creates the label overtop of the battle
        this.factionList = Object.keys(this.factions)
        this.battleParticipantStr = [...this.factionList]
        this.battleParticipantStr.splice(this.battleParticipantStr.length - 1, 1)
        if (this.factionList.length > 2) {
            this.battleParticipantStr = [this.battleParticipantStr.join(", ")]
        }
        this.battleParticipantStr.push(this.factionList[this.factionList.length - 1])


        textSize(12)
        textAlign(CENTER)
        fill(255, 255, 255)
        noStroke()
        text(`Battle between ${this.battleParticipantStr.join(" and ")}`, this.sprite.position.x, this.sprite.position.y)
        text(`Total Strength:${Math.round(this.totalStrength)}`, this.sprite.position.x, this.sprite.position.y + 20)
        text(`Currently winning: ${this.winningFaction} with ${Math.round(this.winningStrength)} troops left`, this.sprite.position.x, this.sprite.position.y + 40)
    }
}

export default Battle