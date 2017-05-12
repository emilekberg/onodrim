import Point, {PointTemplate} from './point';
export default class Vector2 extends Point {
	public static fromTemplate(template:PointTemplate) {
		return new Vector2(template.x, template.y);
	}
	constructor(x?:number, y?:number) {
		super(x, y);
	}

	public length():number {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	}

	public lengthSquared():number {
		return (this.x*this.x)+(this.y*this.y);
	}

	public equals(vector:Vector2):boolean {
		return this.x === vector.x && this.y === vector.y;
	}

	public normalize(): Vector2 {
		const length = this.length();
		this.x = this.x / length;
		this.y = this.y / length;
		return this;
	}

	public add(vector:PointTemplate):Vector2 {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	public sub(vector:PointTemplate):Vector2 {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}

	public multiply(factor: number):Vector2 {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	public scale(vector:PointTemplate):Vector2 {
		this.x *= vector.x;
		this.y *= vector.y;
		return this;
	}

	public divide(vector:PointTemplate):Vector2 {
		this.x /= vector.x;
		this.y /= vector.y;
		return this;
	}

}
