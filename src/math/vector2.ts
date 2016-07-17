import Point from './point'
export default class Vector2 extends Point {
    constructor(x:number, y:number) {
        super(x, y);
    }

    length():number {
        return Math.sqrt((this.x*this.x)+(this.y*this.y));
    }
    lengthSquared():number {
        return (this.x*this.x)+(this.y*this.y);
    }
    add(add:Vector2):Vector2 {
        this.x += add.x;
        this.y += add.y;
        return this;
    }
}