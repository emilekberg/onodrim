import Matrix, { Value } from './matrix3';

export function interpolate(start: number, end: number, delta: number): number {
	return start + delta * (end - start);
}
export function extrapolate(start:number, end:number, delta:number):number {
	return end + delta * (end - start);
}

export function interpolateMatrix(target: Matrix, a: Matrix, b: Matrix, delta:number) {
	const m1 = a.values;
	const m2 = b.values;

	target.values[Value.a] = interpolate(m1[Value.a], m2[Value.a], delta);
	target.values[Value.b] = interpolate(m1[Value.b], m2[Value.b], delta);
	target.values[Value.c] = interpolate(m1[Value.c], m2[Value.c], delta);
	target.values[Value.d] = interpolate(m1[Value.d], m2[Value.d], delta);
	target.values[Value.tx] = interpolate(m1[Value.tx], m2[Value.tx], delta) | 0;
	target.values[Value.ty] = interpolate(m1[Value.ty], m2[Value.ty], delta) | 0;
}
