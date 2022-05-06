const Unit = require('./Unit.js').default
const City = require('./City.js').default

let unitList = []
let battleList = []
let cityList = []
let playerMoney = 0
let playerFaction = "UK"
let dragged = false
let rectStartX = 0
let rectStartY = 0

function createUnit(name,height,width,h,s,l,xPos,yPos,list, strength = 100) {
    const unit = new Unit(name,height,width,h,s,l,xPos,yPos,list, strength)
    return unit
}

setup = () => {
    const canvas = createCanvas(window.outerWidth, window.outerHeight);
    const jeff = createUnit("USA", 50, 50, 0, 100, 20, 300, 200, unitList,2000)
    const dave = createUnit("USA", 50, 50, 0, 100, 20, 200, 200, unitList,2000)
    const derek = createUnit("UK", 50, 50, 0, 100, 20, 400, 200, unitList,2000)
    const john = createUnit("UK", 50, 50, 0, 100, 20, 100, 200, unitList,2000)
    const garry = createUnit("Spain", 50, 50, 0, 100, 20, 600, 200, unitList,2000)
    const jimbo = createUnit("Spain", 50, 50, 0, 100, 20, 500, 200, unitList,2000)
    const london = new City("UK","London",800,400,1,cityList)
}

draw = () => {
    frameRate(60)
    background(10, 10, 10);

    textSize(12)
    textAlign(CENTER)
    fill(255,255,255)
    let roundedPlayerMoney = Math.round(playerMoney * 10) / 10
    text(`£${roundedPlayerMoney >= 1 ? roundedPlayerMoney + "B" : Math.round(playerMoney*1000)}`,canvas.width / 2, 20)

    drawSprites();


    for (const i in unitList) {
        let unit = unitList[i]
        unit.update(unitList,battleList,cityList)

        if (unit.strength<=0) {
            unit.sprite.remove()
            unitList.splice(i,1)
        } 
    }

    for (const i in battleList) {
        
        let battle = battleList[i]
        battle.update()

        for (const i in battle.factionList) {
            let faction = battle.factionList[i] 
            if (battle[faction] <= 1) {
                battle.factionList.splice(i,1)
            }
        }

        if (battle.factionList.length === 1) {
            battle.sprite.remove()
            createUnit(battle.factionList[0],50,50,0,100,20,battle.sprite.position.x,battle.sprite.position.y,unitList,Math.round(battle[battle.factionList[0]]))
            battleList.splice(i,1)
        } 
    }

    for (const i in cityList) {

        let city = cityList[i]

        city.update(unitList)

        if (city.faction === playerFaction) {
            playerMoney += city.value/365*1
        }
    }
    
    if (dragged === true) {
        stroke("#03e3fc")
        noFill()
        let box = rect(rectStartX, rectStartY, mouseX - rectStartX, mouseY - rectStartY)
    }
}

mousePressed = () => {
    if (mouseButton === LEFT) {
        rectStartX = mouseX
        rectStartY = mouseY

        for (const i in unitList) {
            let unit = unitList[i]
            if (unit.sprite.mouseIsOver && unit.faction === playerFaction) {
                unit.selectUnit()
            }
            else {
                unit.deselectUnit()
            }
        }
    }
}

mouseReleased = () => {
    if (mouseButton !== LEFT) return;
    for (const i in unitList) {
        let unit = unitList[i]
        //Check if a unit is within t
        if (Math.min(rectStartX,mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX,mouseX) && Math.min(rectStartY,mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY,mouseY)){
            unit.selectUnit()
        }
    }

    dragged = false
}

mouseDragged = () => {
    if (mouseButton !== LEFT) return;
    dragged = true
}