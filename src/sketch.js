const { QuadTree, initalizeQuadTree, Rectangle, Point } = require('./QuadTree')

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

let qt;

function createUnit(name, height, width, color, xPos, yPos, list, faction = "neutral") {
    unit = new Unit(name, height, width, color, xPos, yPos, list, unitsCreated, faction)
    unitsCreated++
    return unit
}

function sketch(p) {
    p.setup = () => {
        sprites.initalize(p)
        Unit.initalize(p)
        initalizeQuadTree(1, p)
        canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        createUnit("Jeff", 50, 50, "#660000", 300, 200, unitList, "USA")
        createUnit("Dave", 50, 50, "#660000", 200, 200, unitList, "USA")
        createUnit("Derek", 50, 50, "#660000", 400, 200, unitList, "UK")
        createUnit("John", 50, 50, "#660000", 100, 200, unitList, "UK")
    }

    p.draw = () => {
        // timer += p.deltaTime / 1000
        // note for later if we experience extremely daunting performance issues make it so the Point gets updated rather than being re-inserted
        qt = new QuadTree(new Rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2))
        p.frameRate(60)
        p.background(10, 10, 10);

        sprites.drawSprites(); // make sure to draw the sprites before collision checks

        for (const i in unitList) {
            let u = unitList[i]
            u.updateUnit(unitList)
            qt.add(new Point(u.sprite.position.x, u.sprite.position.y, u))
        }
        // qt.draw(); // debug
        for (const i in unitList) {

            unit = unitList[i]

            others = qt.search(new Rectangle(unit.sprite.position.x, unit.sprite.position.y, unit.sprite.width, unit.sprite.height))
            p.noFill()
            p.stroke(0, 255, 0)
            p.rect(unit.sprite.position.x - unit.sprite.width, unit.sprite.position.y - unit.sprite.height, unit.sprite.position.x + unit.sprite.width, unit.sprite.position.y + unit.sprite.height)
            // others.length && console.log(others)
            // reduced sample size
            if (others.length) for (u of others) {
                unit.sprite.collisionDetection(u.unit.sprite)
                console.log(u.unit.sprite)
                console.log(unit.sprite)
            }

            if (unit.strength <= 0) {
                unit.sprite.remove()
                unitList.splice(i, 1)
            }
        }

        // if (timer > damageInterval) timer -= damageInterval;

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
            if (Math.min(rectStartX, p.mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX, p.mouseX) && Math.min(rectStartY, p.mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY, p.mouseY) && !unit.inBattle) {
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