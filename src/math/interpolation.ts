export function interpolate(start:number, end:number, delta:number):number {
    return start + delta * (end - start);
};
export function extrapolate(start:number, end:number, delta:number):number {
    return end + delta * (end - start);
};