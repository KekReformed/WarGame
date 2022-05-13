import p5, { Image, Vector } from 'p5'
import { initalizeQuadTree } from './QuadTree'
import { p } from './sketch'

export enum Anchor {
    top,
    right,
    bottom,
    left
}

interface Scene {
    layered: Sprite[][]
    sprites: Sprite[]
}

let allSprites: Scene = {
    layered: [[]],
    sprites: []
}

function rotateVector(x: number, y: number, rad: number, org: {x:number, y:number}) {
    const rotatedX = (x - org.x) * Math.cos(rad) - (y - org.y) * Math.sin(rad)
    const rotatedY = (x - org.x) * Math.sin(rad) + (y - org.y) * Math.cos(rad)
    return p.createVector(org.x + rotatedX, org.y + rotatedY)
}

function normalizeVector(x: number, y: number) {
    const n = distance(p.createVector(x, y), p.createVector(0, 0))
    return {x: x/n, y: y/n}
}

function distance(v1: Vector, v2: Vector) {
    return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}

export class Sprite {
    position: Vector
    height: number
    width: number
    layer: number
    anchor: Anchor
    userData: any
    color: string
    isColliding: boolean
    velocityRotate: boolean
    rad: number
    id: number
    collisions: Sprite[]
    image?: Image
    velocity?: Vector

    constructor(x: number, y: number, width: number, height: number, userData?: any, layer = 0, anchor = Anchor.top, image?: Image, velocity?: Vector) {
        this.position = p.createVector(x, y)
        this.velocity = velocity || p.createVector(0, 0)
        this.height = height
        this.width = width
        this.layer = layer
        this.anchor = anchor
        this.image = image
        this.userData = userData
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
        let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, {x:this.position.x, y:this.position.y})
        if (
            mouse.x <= this.position.x + (this.width / 2) &&
            mouse.x >= this.position.x - (this.width / 2) &&
            mouse.y <= this.position.y + (this.height / 2) &&
            mouse.y >= this.position.y - (this.height / 2)
        ) {
            return true
        }
        return false
    }

    update() {
        this.position.set(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
    }

    draw() {
        this.update()
        // let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, this.position)
        // p.stroke(255)
        // p.line(this.position.x, this.position.y, mouse.x, mouse.y)
        p.translate(this.position.x, this.position.y)
        p.rotate(this.rad)
        p.translate(-this.position.x, -this.position.y)
        p.fill(this.color)
        p.rect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.position.x + (this.width / 2), this.position.y + (this.height / 2))
        p.translate(this.position.x, this.position.y)
        p.rotate(-this.rad)
        p.translate(-this.position.x, -this.position.y)
    }

    rotate(deg: number) {
        this.rad = (deg * Math.PI) / 180
    }

    setVelocity(x: number, y: number) {
        this.velocity.set(x, y)
        if (this.velocityRotate) this.rad = p.atan2(y, x) || 0;
    }

    remove() {
        allSprites.layered[this.layer] = allSprites.layered[this.layer].filter((x)=> {if (x.id !== this.id) return x})
        delete allSprites.sprites[this.id - 1];
    }

    overlap(sp: Sprite) {
        console.log(this.isColliding)
        if (!this.isColliding) return false;
        for(let i = 0; i < this.collisions.length; i++){
            console.log(this.collisions[i])
            if(this.collisions[i].id === sp.id) return true;
        }
        console.log("no overlap")
        return false;
    }

    collisionDetection(sp: Sprite) {
        if (this.collisions.includes(sp)) return;

        let w = this.width/2, h = this.height/2, spw = sp.width/2, sph = sp.height/2;

        let pos = [
            rotateVector(this.position.x - w, this.position.y - h, this.rad, { x: this.position.x, y: this.position.y }),
            rotateVector(this.position.x + w, this.position.y - h, this.rad, { x: this.position.x, y: this.position.y }),
            rotateVector(this.position.x + w, this.position.y + h, this.rad, { x: this.position.x, y: this.position.y }),
            rotateVector(this.position.x - w, this.position.y + h, this.rad, { x: this.position.x, y: this.position.y })
        ]
        let spos = [
            rotateVector(sp.position.x - spw, sp.position.y - sph, sp.rad, { x: sp.position.x, y: sp.position.y }),
            rotateVector(sp.position.x + spw, sp.position.y - sph, sp.rad, { x: sp.position.x, y: sp.position.y }),
            rotateVector(sp.position.x + spw, sp.position.y + sph, sp.rad, { x: sp.position.x, y: sp.position.y }),
            rotateVector(sp.position.x - spw, sp.position.y + sph, sp.rad, { x: sp.position.x, y: sp.position.y })
        ]

        let vecs = [...pos, ...spos];
        let collision = true;

        // axis
        let axes = [
            { x: pos[1].x - pos[0].x, y: pos[1].y - pos[0].y },
            { x: pos[1].x - pos[2].x, y: pos[1].y - pos[2].y },
            { x: spos[0].x - spos[3].x, y: spos[0].y - spos[3].y },
            { x: spos[0].x - spos[1].x, y: spos[0].y - spos[1].y },
        ]
        for (let i = 0; i < 4; i++) {
            let scalars: [number[], number[]] = [[],[]]; // projection array   
            let axis = axes[i]; // axis to project to
            // projecting
            for(let j = 0; j < 8; j++) {
                let vec = vecs[j]
                let c = (vec.x * axis.x + vec.y * axis.y) / axis.x**2 + axis.y**2 // 90 deg projection
                scalars[p.round(j/7)].push(c*(axis.x**2) + c*(axis.y**2))
            }
            if(p.min(scalars[1]) >= p.max(scalars[0]) || p.max(scalars[1]) <= p.min(scalars[0])) return collision = false
        }
        if(collision) this.addCollision(sp)
        else{
            this.collisions = this.collisions.filter((x)=> {if(x.id !== sp.id) return x})
            this.isColliding = !!this.collisions
        }
    }

    addCollision(sp: Sprite) {
        console.log("collision")
        this.isColliding = true;
        this.collisions.push(sp)
        return true
    }
}

export const drawSprites = () => {
    allSprites.layered.forEach(layer => { // change from foreach
        layer.forEach(sprite => {
            sprite.draw()
        })
    })
}

export const updateSprites = () => { // change from foreach
    allSprites.layered.forEach(layer => {
        layer.forEach(sprite => {
            sprite.update()
        })
    })
}

export const initalize = () => {
    p.rectMode(p.CORNERS)
    initalizeQuadTree(4)
}