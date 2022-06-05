// this will not depend on p5.js for optimization purposes / being able to use this elsewhere if i want :3

import p5 from "p5";
import { p } from "./sketch";
// import { p } from "./sketch"; // debug
import { Sprite } from "./Sprite";

/** The capacity of the of the QuadTree (how many points each section / QuadTree can store) */
let capacity: number = 0;

export class Point {
    x: number
    y: number
    sprite: Sprite

    constructor(x: number, y: number, sprite: Sprite) {
        this.x = x;
        this.y = y;
        // unique to this usecase
        this.sprite = sprite;
    }
}

export class Rectangle {
    x: number
    y: number
    w: number
    h: number
    /** A modification of p5's corner mode (width and height rather than another vector) that has half the width and height instead so that this is centered around it's x and y */
    constructor(x: number, y: number, hw: number, hh: number) {
        this.x = x;
        this.y = y;
        this.w = hw;
        this.h = hh;
    }

    /** Check if a point is within this instance of a rectangle. */
    has(p: Point) {
        return ( // making it = in case we get a point at the exact corner
            p.x >= this.x - this.w &&
            p.x <= this.x + this.w &&
            p.y >= this.y - this.h &&
            p.y <= this.y + this.h
        );
    }

    /** Check if another rectangle intersects this one. */
    intersects(rect: Rectangle) {
        return (
            rect.x - rect.w <= this.x + this.w ||
            rect.x + rect.w >= this.x - this.w ||
            rect.y - rect.h <= this.y + this.h ||
            rect.y + rect.h >= this.y - this.h
        );
    }
}

export class QuadTree {
    rect: Rectangle
    points: Point[]
    subdivided: Boolean
    tr: QuadTree
    tl: QuadTree
    br: QuadTree
    bl: QuadTree

    constructor(rect: Rectangle) {
        this.rect = rect;            // the rectangle the QuadTree instance represents 
        this.points = [];            // stores the points housed within the instance
        this.subdivided = false;     // this is to make sure we haven't already subdivided this instance of quadtree
    }

    add(point: Point) {

        if (!this.rect.has(point)) return false; // because i added the = for edge cases in the has function i need to make this false 

        if (this.points.length < capacity) {
            this.points.push(point);
            return true;
        } else{ 
            if (!this.subdivided) this.subdivide();        // split our rectangle if needed

            // random order of precidence doesn't really matter
            // if - else if to make sure the point only enters one QuadTree
            if (this.tr.add(point)) return true;
            else if (this.tl.add(point)) return true;
            else if (this.br.add(point)) return true;
            else if (this.bl.add(point)) return true;

        }
    }

    search(range: Rectangle) {
        let found: Point[] = []
        if (!this.rect.intersects(range)) return found;
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i]
            if (!(range.x === point.x && range.y === point.y) && range.has(point)) found.push(point);
        }
        if (this.subdivided) {
            found.push(...this.tr.search(range));
            found.push(...this.tl.search(range));
            found.push(...this.br.search(range));
            found.push(...this.bl.search(range));
        }
        return found;
    }

    subdivide() {
        // x + w/2 - x is center so to get our new center we add half the width which is already halved in making the rect making this essentially 1/4th the origional width - (quad) - adding half the width gives us the x coordinate for the new center
        // y - h/2 - same idea as above but we take 1/4th the height of the rectangle away since we want the top section (so we move along y-)
        // w/2 - here this designates the new half width which is half the width of the original's half width making it 1/4th it's actual width
        // h/2 - same as above
        this.tr = new QuadTree(new Rectangle(this.rect.x + this.rect.w / 2, this.rect.y - this.rect.h / 2, this.rect.w / 2, this.rect.h / 2));   // top left
        this.tl = new QuadTree(new Rectangle(this.rect.x - this.rect.w / 2, this.rect.y - this.rect.h / 2, this.rect.w / 2, this.rect.h / 2));   // top right
        this.br = new QuadTree(new Rectangle(this.rect.x + this.rect.w / 2, this.rect.y + this.rect.h / 2, this.rect.w / 2, this.rect.h / 2));   // bottom left
        this.bl = new QuadTree(new Rectangle(this.rect.x - this.rect.w / 2, this.rect.y + this.rect.h / 2, this.rect.w / 2, this.rect.h / 2));   // bottom right

        this.subdivided = true;
    }

    /**
     *          DEBUG ONLY
     *     should be commented
     */

    draw() {
        p.stroke(255);
        p.noFill();
        p.rectMode(p.CENTER);
        p.rect(this.rect.x, this.rect.y, this.rect.w * 2, this.rect.h * 2);
        p.rectMode(p.CORNERS);
        if (this.subdivided) {
            this.tr.draw();
            this.tl.draw();
            this.br.draw();
            this.bl.draw();
        }
        for (let i = 0; i < this.points.length; i++){
            p.fill(255);
            p.noStroke();
            p.circle(this.points[i].x, this.points[i].y, 20);
        }
        p.noStroke();
        p.noFill();
    }

    /**
     *          END OF DEBUG
     */

}

export const initalizeQuadTree = (cap: number) => { // a debug only instance of p5
    capacity = cap;
}

