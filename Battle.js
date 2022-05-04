class Battle {

    constructor(positionX,positionY,totalStrength,factionList) {
        this.positionX = positionX
        this.positionY = positionY
        this.sprite = createSprite(positionX, positionY, 100, 100)
        this.sprite.setDefaultCollider()
        this.sprite.shapeColor = `rgb(0,0,255)`
        this.damageInterval = 0.1
        this.timer = 0
        this.totalStrength = totalStrength
        this.winningStrength = 0
        this.factionList = [factionList[0][0],factionList[1][0]]

        for (const i in factionList) {
            this[factionList[0][0]] = factionList[0][1]
            this[factionList[1][0]] = factionList[1][1]
        }
    }

    updateBattle() {
        this.timer+=deltaTime/1000

        if (this.timer > this.damageInterval) {
            this.totalStrength = 0
            for (const i in this.factionList) {
                let faction = this.factionList[i]
                
                this.totalStrength += this[faction]
            }

            for (const i in this.factionList) {
                let faction = this.factionList[i]
                
                
                this[faction] -= Math.min(0.025*(this.totalStrength-this[faction]),100)
                
                if (this[faction] > this.winningStrength) this.winningFaction = faction;
            }
        }

        console.log (this)
        if (this.timer > this.damageInterval) this.timer -= this.damageInterval;
        
        //Creates the label overtop of the battle
        this.battleParticipantStr = [...this.factionList]
        this.battleParticipantStr.splice(this.battleParticipantStr.length-1,1)
        if (this.factionList.length > 2) {
            this.battleParticipantStr = [this.battleParticipantStr.join(", ")]
        }
        this.battleParticipantStr.push(this.factionList[this.factionList.length-1])


        textSize(12)
        textAlign(CENTER)
        fill(255,255,255)
        text(`Battle between ${this.battleParticipantStr.join(" and ")}`,this.sprite.position.x,this.sprite.position.y)
        text(`Total Strength:${Math.round(this.totalStrength)}`,this.sprite.position.x,this.sprite.position.y+20)
        text(`Currently winning: ${this.winningFaction} with ${Math.round(this[this.winningFaction])} troops left`,this.sprite.position.x,this.sprite.position.y+40)
    }
}