Unit = require('./unit')

let unitList = []
let battleList = []
let unitsCreated = 0
let boxCreated = false
let dragged = false
let rectStartX = 0
let rectStartY = 0

function createUnit(name,height,width,h,s,l,xPos,yPos,list, strength = 100) {
    unit = new Unit(name,height,width,h,s,l,xPos,yPos,list,unitsCreated, strength)
    unitsCreated++
    return unit
}

setup = () => {
    canvas = createCanvas(window.outerWidth, window.outerHeight);
    jeff = createUnit("USA", 50, 50, 0, 100, 20, 300, 200, unitList,2000)
    dave = createUnit("USA", 50, 50, 0, 100, 20, 200, 200, unitList,2000)
    derek = createUnit("UK", 50, 50, 0, 100, 20, 400, 200, unitList,2000)
    john = createUnit("UK", 50, 50, 0, 100, 20, 100, 200, unitList,2000)
    derek = createUnit("Spain", 50, 50, 0, 100, 20, 600, 200, unitList,2000)
    john = createUnit("Spain", 50, 50, 0, 100, 20, 500, 200, unitList,2000)
}

draw = () => {
    frameRate(60)
    background(10, 10, 10);
    drawSprites();

    for (const i in unitList){
        unit = unitList[i]
        unit.updateUnit(unitList,battleList)

        if (unit.strength<=0) {
            unit.sprite.remove()
            unitList.splice(i,1)
        } 
    }

    for (const i in battleList){
        
        battle = battleList[i]
        battle.updateBattle()

        for (const i in battle.factionList) {
            let faction = battle.factionList[i] 
            if (battle[faction] <= 1) {
                battle.factionList.splice(i,1)
            }
        }

        if (battle.factionList.length === 1) {
            battle.sprite.remove()
            createUnit(battle.factionList[0],50,50,0,100,20,400,200,unitList,Math.round(battle[battle.factionList[0]]))
            battleList.splice(i,1)
        } 
    }
    
    if (dragged === true) {
        stroke("#03e3fc")
        noFill()
        box = rect(rectStartX, rectStartY, mouseX - rectStartX, mouseY - rectStartY)
    }
}

mousePressed = () => {
    if (mouseButton === LEFT) {
        rectStartX = mouseX
        rectStartY = mouseY

        for (const i in unitList) {
            unit = unitList[i]
            if (unit.sprite.mouseIsOver) {
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
        unit = unitList[i]
        //Check if a unit is within t
        if (Math.min(rectStartX,mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX,mouseX) && Math.min(rectStartY,mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY,mouseY)){
            unit.selectUnit()
        }
    }

    dragged = false
    boxCreated = false
}

mouseDragged = () => {
    if (mouseButton !== LEFT) return;
    dragged = true
}