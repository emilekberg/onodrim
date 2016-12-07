export interface Vector3Template {
    x:number;
    y:number;
    z:number;
}
export default class Vector3 {
    public static fromTemplate(template?:Vector3Template) {
        return new Vector3(template.x, template.y, template.z);
    }
    public static makeLeft() {
        return new Vector3(1,0,0);
    }
    public static makeUp() {
        return new Vector3(0,1,0);
    }
    public x:number;
    public y:number;
    public z:number;
    constructor(x:number = 0, y:number = 0, z:number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public length():number {
        return Math.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z));
    }

    public lengthSquared():number {
        return (this.x*this.x)+(this.y*this.y)+(this.z*this.z);
    }

    public equals(vector:Vector3):boolean {
        return this.x === vector.x && this.y === vector.y && this.z === this.z;
    }

    public add(vector:Vector3):Vector3 {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }

    public sub(vector:Vector3):Vector3 {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }

    public multiply(vector:Vector3):Vector3 {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        return this;
    }

    public divide(vector:Vector3):Vector3 {
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;
        return this;
    }
}
