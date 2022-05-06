Unit = require('./unit')
sprites = require('./Sprite')
p5 = require('p5')

const damageInterval = 0.1
let unitList = []
let unitsCreated = 0
let boxCreated = false
let dragged = false
let rectStartX = 0
let rectStartY = 0
let timer = 0

function createUnit(name,height,width,color,xPos,yPos,list, faction = "neutral") {
    unit = new Unit(name,height,width,color,xPos,yPos,list,unitsCreated, faction)
    unitsCreated++
    return unit
}

function sketch(p){
    p.setup = () => {
        sprites.initalizeSprites(p)
        Unit.initalizeUnits(p)
        canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        jeff = createUnit("Jeff", 50, 50, "#660000", 300, 200, unitList, "USA")
        dave = createUnit("Dave", 50, 50, "#660000", 200, 200, unitList, "USA")
        derek = createUnit("Derek", 50, 50, "#660000", 400, 200, unitList, "UK")
        john = createUnit("John", 50, 50, "#660000", 100, 200, unitList, "UK")
    }
    
    p.draw = () => {
        p.frameRate(60)
        p.background(10, 10, 10);
        sprites.drawSprites();
        timer+=p.deltaTime/1000
    
        for (const i in unitList){
            
            unit = unitList[i]
            unit.updateUnit(unitList)
            
            if (timer>damageInterval) {
                if (unit.inBattle) unit.strength -= 1*unit.collisionCount;
            }
    
            if (unit.strength<=0) {
                unit.sprite.remove()
                unitList.splice(i,1)
            } 
        }
        
        if (timer>damageInterval) timer-=damageInterval;
        
        if (dragged === true) {
            p.stroke("#03e3fc")
            p.noFill()
            box = p.rect(rectStartX, rectStartY, p.mouseX, p.mouseY)
        }
    }
    
    p.mousePressed = () => {
        if (p.mouseButton === p.LEFT) {
            rectStartX = p.mouseX
            rectStartY = p.mouseY
            
            for (const i in unitList) {
                unit.sprite.rotate(45)
                unit = unitList[i]
                if (unit.sprite.isMouseOver() && !unit.inBattle) {
                    unit.selectUnit()
                }
                else {
                    unit.deselectUnit()
                }
            }
        }
    }
    
    p.mouseReleased = () => {
        if (p.mouseButton !== p.LEFT) return;
        for (const i in unitList) {
            unit = unitList[i]
            //Check if a unit is within the box
            if (Math.min(rectStartX,p.mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX,p.mouseX) && Math.min(rectStartY,p.mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY,p.mouseY) && !unit.inBattle){
                unit.selectUnit()
            }
        }
    
        dragged = false
        boxCreated = false
    }
    
    p.mouseDragged = () => {
        if (p.mouseButton !== p.LEFT) return;
        dragged = true
    }
}

let pInst = new p5(sketch)