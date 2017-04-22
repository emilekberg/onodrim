import Entity from '../entity';
import Transform2D from '../components/transform2d';
import Sprite, { SpriteTemplate } from '../components/sprite';
import RenderComponent from '../components/render-component';
import ParticleSystem from './particle-system';

export default class Particle extends Sprite {
	public transform:Transform2D;
	constructor(entity: Entity, template: SpriteTemplate) {
		super(entity, template);
		const transform2D = entity.getComponent(Transform2D);
		if(transform2D) {
			this.transform = transform2D;
		}
	}

	public reset() {
		super.reset();
		this.init();
	}

	public init() {
		this.x = 400;
		this.y = 200;
	}

	public fixedUpdate():boolean {
		super.fixedUpdate();
		return this._isAlive();
	}

	public updateTransform()
	{
		this._renderState.matrix
			.identity()
			.scale(this._texture.rect.w * 0.5, this._texture.rect.h * 0.5)
			.multiply(this._transform.worldMatrix)
			.translate(this.x, this.y);
	}

	protected _isAlive():boolean {
		return true;
	}
}
