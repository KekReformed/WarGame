const { client } = require("./index.js")
const { default: Infantry } = require("./Infantry.js")

const Unit = require("./Unit.js").default
const City = require("./City.js").default
const ProductionDepot = require("./ProductionDepot.js").default

let unitList = []
let battleList = []
let cityList = []
let depotList = []

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
        unitList,
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
        unitList,
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
        unitList,
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
        unitList,
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
        unitList,
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
        unitList,
        strength: 2000
    })

    const london = new City("Spain", "London", 800, 400, 100, cityList)
    const barracks = new ProductionDepot({
        faction: "Neutral",
        positionX: 400,
        positionY: 600,
        depotList,
        city: "None",
        inCity: false
    })
}

draw = () => {
    console.log(dragged)
    frameRate(60)
    background(10, 10, 10);

    textSize(12)
    textAlign(CENTER)
    fill(255,255,255)
    noStroke()
    let roundedPlayerMoney = Math.round(client.money)
    text(`£${roundedPlayerMoney >= 1000 ? Math.round(roundedPlayerMoney/100)/10 + "B" : roundedPlayerMoney+ "M"}`,canvas.width / 2, 20)

    drawSprites();

    //Update units
    for (const i in unitList) {
        let unit = unitList[i]
        unit.update(unitList,battleList,cityList)

        if (unit.strength<=0) {
            unit.sprite.remove()
            unitList.splice(i,1)
        } 
    }

    //Update battles
    for (const i in battleList) {
        
        let battle = battleList[i]
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
            console.log("Removed")
            battle.sprite.remove()
            bob = new Unit(({
                faction: factionList[0],
                height: 50,
                width: 50,
                h: 0,
                s: 100,
                l: 20,
                positionX: battle.sprite.position.x,
                positionY: battle.sprite.position.y,
                unitList,
                strength: Math.round(battle.factions[factionList[0]].totalStrength)
            }))

            battleList.splice(i,1)
        } 
    }

    //Update cities
    for (const i in cityList) {

        let city = cityList[i]

        city.update(unitList)

        if (city.faction === client.faction) {
            client.money += city.value/365*1000
        }
    }
    
    //Update depots
    for (const i in depotList) {

        let depot = depotList[i]

        depot.update(unitList)
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
        for (const i in unitList) {
            let unit = unitList[i]
            if (unit.sprite.mouseIsOver && unit.faction === client.faction) {
                unit.select()
            }
            else {
                unit.deselect()
            }
        }


        //Select a depot by clicking on it
        for (const i in depotList) {
            let depot = depotList[i]
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
    console.log("released")

    for (const i in unitList) {
        let unit = unitList[i]

        //Check if a unit is within the rectangle
        if (Math.min(rectStartX,mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX,mouseX) && Math.min(rectStartY,mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY,mouseY) && unit.faction === client.faction){
            unit.select()
        }
    }

    for (const i in depotList) {
        let depot = depotList[i]

        //Check if a depot is within the rectangle
        if (Math.min(rectStartX,mouseX) < depot.sprite.position.x && depot.sprite.position.x < Math.max(rectStartX,mouseX) && Math.min(rectStartY,mouseY) < depot.sprite.position.y && depot.sprite.position.y < Math.max(rectStartY,mouseY) && depot.faction === client.faction){
            depot.select()
        }
    }

    console.log(dragged)
    dragged = false
}

mouseDragged = () => {
    if (mouseButton !== LEFT) return;
    dragged = true
}