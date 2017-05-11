export interface PointTemplate {
	x:number;
	y:number;
}
export default class Point implements PointTemplate {
	public x:number;
	public y:number;
	constructor(x:number = 0, y:number = 0) {
		this.x = x;
		this.y = y;
	}

	public parseTemplate(template:PointTemplate) {
		this.set(template.x, template.y);
	}

	public isZero():boolean {
		return !(this.x || this.y);
	}

	public set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
