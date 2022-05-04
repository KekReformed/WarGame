class Unit {

    constructor(height, width, h, s, l, positionX, positionY, list) {
        this.height = height
        this.width = width;
        this.h = h
        this.s = s
        this.l = l
        this.selected = false
        this.faction = "neutral"
        this.strength = 100
        this.sprite = createSprite(positionX, positionY, height, width)
        this.goToPoint = this.sprite.position
        this.sprite.shapeColor = `hsl(${h},${s}%,${l}%)`
        this.sprite.rotateToDirection = true
        this.sprite.setDefaultCollider()
        list.push(this)
    }

    updateUnit(){
        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);
        if (this.sprite.collide(allSprites)) this.sprite.setVelocity(0, 0)
        this.sprite.mouseUpdate()

        //Move the unit if right click pressed whilst selected
        if (this.selected && mouseWentUp(RIGHT)) {

            let mousePos = createVector(camera.mouseX, camera.mouseY)

            if (mouseButton === RIGHT) {
                this.goTo(mousePos, 5)
            }
        }
    }

    selectUnit() {
        this.selected = true
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,50%)`)
    }

    deselectUnit(){
        this.selected = false
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,${this.l}%)`)
    }

    goTo(destination, speed = 1) {
        this.goToPoint = createVector(destination.x,destination.y)
        console.log(destination.x,destination.y)
        this.vector = createVector(destination.x - this.sprite.position.x, destination.y - this.sprite.position.y)
        this.vector.normalize()
        this.vector.mult(speed)
        this.sprite.setVelocity(this.vector.x,this.vector.y)
    }
}