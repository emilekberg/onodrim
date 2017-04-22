import {Graphics, Time, Components, Resources} from 'onodrim';
import * as Onodrim from 'onodrim';
const lifeTime = 4;
export default class Particle extends Graphics.Particle {
	public velocity: Onodrim.Math.Vector2;
	public time: number;
	constructor(entity: Onodrim.Entity) {
		const template: Onodrim.Components.SpriteTemplate = {
			texture: new Resources.Texture({
					url: 'square',
					w: 16,
					h: 16
			})
		};
		super(entity, template);
		this.velocity = new Onodrim.Math.Vector2(0, 0);
	}

	public init() {
		super.init();
		const dir = (Math.random()*Math.PI*2);
		this.velocity.x = Math.cos(dir) * 2;
		this.velocity.y = Math.sin(dir) * 2;
		this.time = 0;

	}

	public fixedUpdate(): boolean {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.velocity.y += Time.deltaTime;
		this.time += Time.deltaTime;
		this.alpha = 1 - (this.time / lifeTime);
		return super.fixedUpdate();
	}

	protected _isAlive(): boolean {
		return (this.time < lifeTime);
	}

}
