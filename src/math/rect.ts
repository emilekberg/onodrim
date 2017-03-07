export interface RectTemplate {
    x: number;
    y: number;
    w: number;
    h: number;
}
export default class Rect implements RectTemplate{
    public get x():number {
        return this.array[0];
    }
    public set x(value: number) {
        this.array[0] = value;
    }
    public get y():number {
        return this.array[1];
    }
    public set y(value: number) {
        this.array[1] = value;
    }
    public get w():number{
        return this.array[2];
    }
    public set w(value: number) {
        this.array[2] = value;
    }
    public get h():number{
        return this.array[3];
    }
    public set h(value: number) {
        this.array[3] = value;
    }
    public readonly array: number[];
    constructor(x:number = 0,y:number = 0,w:number = 0,h:number = 0) {
        this.array = [];
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
