const { client, unitTypes } = require("./index.js")
const { default: Infantry } = require("./Infantry.js")

const Unit = require("./Unit.js").default
const City = require("./City.js").default
const ProductionDepot = require("./ProductionDepot.js").default

var dragged = false
var rectStartX = 0
var rectStartY = 0

setup = () => {
    angleMode(DEGREES)
    const canvas = createCanvas(window.outerWidth, window.outerHeight);
    const jeff = new Infantry({
        faction: "USA",
        height: 50,
        width: 50,
        h: 0,
        s: 100,
        l: 20,
        positionX: 100,
        positionY: 200,
        strength: 2000
    })

    const dave = new Infantry({
        faction: "USA",
        height: 50,
        width: 50,
        h: 0,
        s: 100,
        l: 20,
        positionX: 200,
        positionY: 200,
        strength: 2000
    })

    const derek = new Infantry({
        faction: "UK",
        height: 50,
        width: 50,
        h: 0,
        s: 100,
        l: 20,
        positionX: 300,
        positionY: 200,
        strength: 2000
    })

    const john = new Infantry({
        faction: "UK",
        height: 50,
        width: 50,
        h: 0,
        s: 100,
        l: 20,
        positionX: 400,
        positionY: 200,
        strength: 2000
    })

    const garry = new Infantry({
        faction: "Spain",
        height: 50,
        width: 50,
        h: 0,
        s: 100,
        l: 20,
        positionX: 600,
        positionY: 200,
        strength: 2000
    })

    const jimbo = new Infantry({
        faction: "Spain",
        height: 50,
        width: 50,
        h: 0,
        s: 100,
        l: 20,
        positionX: 500,
        positionY: 200,
        strength: 2000
    })

    const london = new City("UK", "London", 800, 400, 100)

    const barracks = new ProductionDepot({
        faction: "UK",
        positionX: 400,
        positionY: 600,
        city: "None",
        inCity: false
    })
}

draw = () => {
    frameRate(60)
    background(10, 10, 10);

    textSize(12)
    textAlign(CENTER)
    fill(255, 255, 255)
    noStroke()
    let roundedPlayerMoney = Math.round(client.money)
    text(`£${roundedPlayerMoney >= 1000 ? Math.round(roundedPlayerMoney / 100) / 10 + "B" : roundedPlayerMoney + "M"}`, canvas.width / 2, 20)

    drawSprites();

    //Update units
    for (const i in client.globalUnits) {
        let unit = client.globalUnits[i]
        unit.update()

        if (unit.strength <= 0) {
            unit.sprite.remove()
            client.globalUnits.splice(i, 1)
        }
    }

    //Update battles
    for (const i in client.globalBattles) {

        let battle = client.globalBattles[i]
        battle.update()

        for (const factionName in battle.factions) {
            let faction = battle.factions[factionName]

            if (faction.totalStrength <= 1) {
                delete battle.factions[factionName]
                break
            }
        }

        let factionList = Object.keys(battle.factions)

        if (factionList.length === 1) {
            battle.sprite.remove()

            let units = Object.keys(battle.factions[factionList[0]].units)

            let unitData = {
                faction: factionList[0],
                height: 50,
                width: 50,
                h: 0,
                s: 100,
                l: 20,
                positionX: battle.sprite.position.x-50*units.length,
                positionY: battle.sprite.position.y,
                strength: Math.round(battle.factions[factionList[0]].totalStrength)
            }

            for (const i in units) {
                let unitType = units[i]
                new unitTypes[unitType](unitData)

                unitData.positionX += 50
            }
            client.globalBattles.splice(i, 1)
        }
    }

    //Update cities
    for (const i in client.globalCities) {

        let city = client.globalCities[i]

        city.update()

        if (city.faction === client.faction) {
            client.money += city.value / 365 * 1000
        }
    }

    //Update depots
    for (const i in client.globalDepots) {

        let depot = client.globalDepots[i]

        depot.update()
    }

    //Update UI elements
    for (const i in client.globalUIComponents) {

        let UIComponent = client.globalUIComponents[i]

        UIComponent.update()
    }

    if (dragged === true) {
        stroke("#03e3fc")
        noFill()
        rect(rectStartX, rectStartY, mouseX - rectStartX, mouseY - rectStartY)
    }
}

mousePressed = () => {
    if (mouseButton === LEFT) {
        rectStartX = mouseX
        rectStartY = mouseY


        //Select a unit by clicking on it
        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]
            if (unit.sprite.mouseIsOver && unit.faction === client.faction) {
                unit.select()
            }
            else {
                unit.deselect()
            }
        }


        //Select a depot by clicking on it
        for (const i in client.globalDepots) {
            let depot = client.globalDepots[i]
            if (depot.sprite.mouseIsOver && unit.faction === client.faction) {
                depot.select()
            }
            else {
                depot.deselect()
            }
        }

    }
}

mouseReleased = () => {
    if (mouseButton !== LEFT) return;

    for (const i in client.globalUnits) {
        let unit = client.globalUnits[i]

        //Check if a unit is within the rectangle
        if (Math.min(rectStartX, mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX, mouseX) && Math.min(rectStartY, mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY, mouseY)) {
            unit.select()
        }
    }

    for (const i in client.globalDepots) {
        let depot = client.globalDepots[i]

        //Check if a depot is within the rectangle
        if (Math.min(rectStartX, mouseX) < depot.sprite.position.x && depot.sprite.position.x < Math.max(rectStartX, mouseX) && Math.min(rectStartY, mouseY) < depot.sprite.position.y && depot.sprite.position.y < Math.max(rectStartY, mouseY) && depot.faction === client.faction) {
            depot.select()
        }
    }

    dragged = false
}

mouseDragged = () => {
    if (mouseButton !== LEFT) return;
    dragged = true
}