export default class Color {
    public static get red():Color { return Color.fromHEX(0xFFFF0000); }
    public static fromRGBA(r:number, g:number, b:number, a:number = 1):Color {
        return new Color(r, g, b, a);
    }

    public static fromHEX(hexColor: number) {
        const color = new Color(1,1,1,1);
        color.setHEX(hexColor);
        return color;
    }

    public get r(): number {
        return this.array[0];
    }
    public set r(value) {
        this.array[0] = value;
    }
    public get g(): number{
        return this.array[1];
    }
    public set g(value) {
        this.array[1] = value;
    }
    public get b(): number{
        return this.array[2];
    }
    public set b(value) {
        this.array[2] = value;
    }
    public get a(): number{
        return this.array[3];
    }
    public set a(value) {
        this.array[3] = value;
    }

    public readonly array: Float32Array;
    constructor(r: number, g: number, b: number, a: number) {
        this.array = new Float32Array([r,g,b,a]);
    }

    public setRGBA(r: number, g: number, b: number, a: number = this.a): void {
        this.array[0] = r;
        this.array[1] = g;
        this.array[2] = b;
        this.array[3] = a;
    }

    public setHEX(hexColor: number) {
        this.array[0] = ((hexColor >> 16) & 0xFF) / 255;
        this.array[1] = ((hexColor >> 8) & 0xFF) / 255;
        this.array[2] = ((hexColor) & 0xFF) / 255;
    }

    public toNumber():number {
        return ((this.array[3] * 255) << 24) +
            ((this.array[0] * 255) << 16) +
            ((this.array[1] * 255) << 8) +
            (this.array[2] * 255);
    }
}
