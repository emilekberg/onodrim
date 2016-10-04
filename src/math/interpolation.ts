export function lerp(t:number, b:number, c:number, d:number):number {
    return b + (c * (t / d));
};
