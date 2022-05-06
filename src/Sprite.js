Anchor = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3
}

let allSprites = {}
let p = undefined
let allCollisions = []
let allDomainOverlaps = []

function rotateVector(x, y, rad, org = p.createVector(0, 0)) {
    const rotatedX = (x - org.x) * Math.cos(rad) - (y - org.y) * Math.sin(rad)
    const rotatedY = (x - org.x) * Math.sin(rad) + (y - org.y) * Math.cos(rad)
    return p.createVector(org.x + rotatedX, org.y + rotatedY)
}

class Sprite {
    constructor(x, y, width, height, layer = 0, anchor = Anchor.top, image, velocity) {
        this.position = p.createVector(x, y)
        this.velocity = velocity || p.createVector(0, 0)
        this.height = height
        this.width = width
        this.layer = layer
        this.anchor = anchor
        this.image = image
        this.color = "#000000"
        this.isColliding = false
        this.velocityRotate = true
        this.rad = 0
        this.id = allSprites.sprites.length + 1
        this.collisions = []
        allSprites.layered[layer].push(this)
        allSprites.sprites.push(this)
    }

    isMouseOver() {
        let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, this.position)
        if (
            mouse.x <= this.position.x + (this.width / 2) &&
            mouse.x >= this.position.x - (this.width / 2) &&
            mouse.y <= this.position.y + (this.height / 2) &&
            mouse.y >= this.position.y - (this.height / 2)
        ) {
            // console.log("mouseOver "+this.id)
            return true
        }
        return false
    }

    update() {
        this.position.set(this.position.x + this.velocity.x, this.position.y + this.velocity.y)

        this.collisions = []
    }

    draw() {
        this.update()
        let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, this.position)
        p.stroke(255)
        p.line(this.position.x, this.position.y, mouse.x, mouse.y)
        p.translate(this.position.x, this.position.y)
        p.rotate(this.rad)
        p.translate(-this.position.x, -this.position.y)
        p.fill(this.color)
        p.rect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.position.x + (this.width / 2), this.position.y + (this.height / 2))
        p.translate(this.position.x, this.position.y)
        p.rotate(-this.rad)
        p.translate(-this.position.x, -this.position.y)
    }

    rotate(deg) {
        this.rad = (deg * Math.PI) / 180
    }

    setVelocity(x, y) {
        this.velocity.set(x, y)
    }

    overlap(sp) {
        let sps = this.areaScan()
        let out = false;
        sps.forEach(s => {
            if (sp.id == s.id) {
                // out = this.collisionDetection(sp)
            }
        })
        return out
    }

    collisionDetection(sp) {
        let w = this.width / 2, h = this.height / 2,
            spw = sp.width / 2, sph = sp.height / 2
        // i had to do this because jack wanted centered anchors for shit
        let pos = [p.createVector(this.position.x - w, this.position.y - h), p.createVector(this.position.x + w, this.position.y - h), p.createVector(this.position.x + w, this.position.y + h), p.createVector(this.position.x - w, this.position.y + h)]
        let spos = [p.createVector(sp.position.x - spw, sp.position.y - sph), p.createVector(sp.position.x + spw, sp.position.y - sph), p.createVector(sp.position.x + spw, sp.position.y + sph), p.createVector(sp.position.x - spw, sp.position.y + sph)]

        if (this.position.dist(sp.position) <= (Math.min(w, h) + Math.min(spw, sph))) return this.addCollision(sp)
        let dx = sp.position.x - this.position.x
        let dy = sp.position.y - this.position.y
        if (dx > 0) {
            //sp right
            // this left
            for (let i = 0; i < 4; i++) {
                if (pos[i].x < sp.position.x) {

                }
            }
        }

        if (condition1 && (condition2 || condition4) || condition3 && (condition2 || condition4)) {
            return this.addCollision(sp)
        }
    }

    addCollision(sp) {
        this.collisions.push(sp)
        sp.collisions.push(this)
        return true
    }

    areaScan() {
        let d = Math.sqrt((this.width / 2) ** 2 + (this.height / 2) ** 2)
        let scanSprites = []
        allSprites.sprites.forEach(sp => {
            if (sp.id === this.id) return
            let d2 = Math.sqrt((sp.width / 2) ** 2 + (sp.height / 2) ** 2)
            if (this.position.dist(sp.position) < d + d2) {
                scanSprites.push(sp)
            }
        })
        return scanSprites;
    }
}

module.exports.drawSprites = () => {
    allSprites.layered.forEach(layer => {
        layer.forEach(sprite => {
            sprite.draw()
        })
    })
}

module.exports.Sprite = Sprite
module.exports.Anchor = Anchor

module.exports.initalizeSprites = (pInst) => {
    p = pInst
    p.rectMode(p.CORNERS)
    allSprites["layered"] = [[]]
    allSprites["sprites"] = []
}