class Battle {

    constructor(positionX, positionY, firstUnit, secondUnit) {
        this.positionX = positionX
        this.positionY = positionY
        this.factions = { [firstUnit.faction]: {
            units: {[firstUnit.type]: firstUnit.effectiveStrength}}, [secondUnit.faction]: { units: {[secondUnit.type]: secondUnit.effectiveStrength} }}
        this.totalStrength = 0
        this.sprite = createSprite(positionX, positionY, 100, 100)
        this.sprite.depth = -1
        this.sprite.setDefaultCollider()
        this.sprite.shapeColor = `rgb(0,0,255)`
        this.damageInterval = 0.1
        this.timer = 0
        
        for (const factionName in this.factions) {
            let faction = this.factions[factionName]
            faction.totalStrength = 0

            for (const unitType in faction.units) {
                this.totalStrength += faction.units[unitType]
                faction.totalStrength += faction.units[unitType]
            }
        }
    }

    update() {
        this.timer += deltaTime / 1000

        if (this.timer > this.damageInterval) {
            this.winningStrength = 0

            let totalDamage = 0
            for (const factionName in this.factions) {
                let faction = this.factions[factionName]

                let damage = Math.min(0.025 * (this.totalStrength - faction.totalStrength), 100)

                
                let uniqueUnitCount = Object.keys(faction.units).length
                
                totalDamage += damage
                faction.totalStrength -= damage

                for (let unitType in faction.units) {
                    faction.units[unitType] -= damage / uniqueUnitCount
                }

                if (faction.totalStrength > this.winningStrength) {
                    this.winningFaction = factionName
                    this.winningStrength = faction.totalStrength
                }
            }

            this.totalStrength -= totalDamage
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