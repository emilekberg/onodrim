export function lerp(start:number, end:number, delta:number):number {
    return start + delta * (end - start);
};
