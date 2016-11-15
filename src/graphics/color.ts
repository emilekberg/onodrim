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

    public r: number;
    public g: number;
    public b: number;
    public a: number;
    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public setRGBA(r: number, g: number, b: number, a: number = this.a): void {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public setHEX(hexColor: number) {
        this.r = ((hexColor >> 16) & 0xFF) / 255;
        this.g = ((hexColor >> 8) & 0xFF) / 255;
        this.b = ((hexColor) & 0xFF) / 255;
    }

    public toNumber():number {
        return ((this.a * 255) << 24) + ((this.r * 255) << 16) + ((this.g * 255) << 8) + (this.b * 255);
    }
}
