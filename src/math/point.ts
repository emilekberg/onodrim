export interface PointTemplate {
    x:number;
    y:number;
}
export default class Point implements PointTemplate {
    x: number;
    y: number;
    constructor(x:number=0, y:number=0) {
        this.x = x;
        this.y = y;
    }

    isZero():boolean {
        return !(this.x || this.y)
    }
}