export interface RectTemplate {
    x: number;
    y: number;
    w: number;
    h: number;
}
export default class Rect implements RectTemplate{
    public x:number;
    public y:number;
    public w:number;
    public h:number;
    constructor(x:number = 0,y:number = 0,w:number = 0,h:number = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
