// this will not depend on p5.js for optimization purposes / being able to use this elsewhere if i want :3

capacity = 0;    // the capacity of the of the QuadTree (how many points each section / QuadTree can store)
p = undefined;  // p5 instance (unique to this usecase)

class Point {
    constructor(x, y, unit) {
        this.x = x;
        this.y = y;
        // unique to this usecase
        this.unit = unit;
    }
}

class Rectangle {
    // a modification of p5's corner mode (width and height rather than another vector) that has half the width and height instead so that this is centered around it's x and y
    constructor(x, y, hw, hh) {
        this.x = x;
        this.y = y;
        this.w = hw;
        this.h = hh;
    }

    // check if a point is within this instance of a rectangle
    has(p) {
        // there you go amy
        return ( // making it = in case we get a point at the exact corner
            p.x >= this.x - this.w &&
            p.x <= this.x + this.w &&
            p.y >= this.y - this.h &&
            p.y <= this.y + this.h
        );
    }

    // check if another rectangle intersects this one
    intersects(rect) {
        // there you go amy
        return (
            rect.x - rect.w < this.x + this.w ||
            rect.x + rect.w > this.x - this.w ||
            rect.y - rect.h < this.y + this.h ||
            rect.y + rect.h > this.y - this.h
        );
    }
}

class QuadTree {
    constructor(rect) {
        this.rect = rect;            // the rectangle the QuadTree instance represents 
        this.points = [];            // stores the points housed within the instance
        this.subdivided = false;     // this is to make sure we haven't already subdivided this instance of quadtree
    }

    add(point) {

        if (!this.rect.has(point)) return false; // because i added the = for edge cases in the has function i need to make this false 

        if (this.points.length < capacity) {
            this.points.push(point);
        } else if (!this.subdivided) {
            this.subdivide();        // split our rectangle
        } else {
            // random order of precidence doesn't really matter
            // if - else if to make sure the point only enters one QuadTree
            if (this.tr.add(point)) return true;
            else if (this.tl.add(point)) return true;
            else if (this.br.add(point)) return true;
            else if (this.bl.add(point)) return true;
        }
    }

    search(range) {
        let found = []
        if (!this.rect.intersects(range)) return found; // optamization
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i] 
            if ((point.x !== range.x && point.y !== range.y) && range.has(point)) found.push(point);
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
        p.fill(255);
        p.noStroke();
        for (let i; i < this.points.length; i++){
            p.circle(this.points[i].x, this.points[i].y, 5);
        }
    }
    /**
     *          END OF DEBUG
     */

}

module.exports.QuadTree = QuadTree
module.exports.Point = Point
module.exports.Rectangle = Rectangle

module.exports.initalizeQuadTree = (cap, p5 = undefined) => { // a debug only instance of p5
    capacity = cap;
    p = p5;
}

