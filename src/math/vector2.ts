import Point, {PointTemplate} from './point';
export default class Vector2 extends Point {
    public static fromTemplate(template:PointTemplate) {
        return new Vector2(template.x, template.y);
    }
    constructor(x?:number, y?:number) {
        super(x, y);
    }

    public length():number {
        return Math.sqrt((this.x*this.x)+(this.y*this.y));
    }

    public lengthSquared():number {
        return (this.x*this.x)+(this.y*this.y);
    }

    public equals(vector:Vector2):boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    public add(vector:Vector2):Vector2 {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    public sub(vector:Vector2):Vector2 {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    public multiply(vector:Vector2):Vector2 {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }

    public divide(vector:Vector2):Vector2 {
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    }

}
