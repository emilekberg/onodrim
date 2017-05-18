// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/display/DisplayObject.js
import ComponentFactory from './component-factory';
import Component, {Template} from './component';
import Entity from '../entity';
import Rect, {RectTemplate} from '../math/rect';
import Transform2D from './transform2d';
import Point, { PointTemplate } from '../math/point';
export interface ColliderTemplate extends Template {
	rect?: RectTemplate;
}

export default class Collider extends Component {
	private _transform: Transform2D;
	private _rect: Rect;
	public get x(): number {
		return this._rect.x + this._transform.worldX;
	}
	public get y(): number {
		return this._rect.y + this._transform.worldY;
	}

	public get w(): number {
		return this._rect.w * this._transform.worldScaleX;
	}
	public get h(): number {
		return this._rect.h * this._transform.worldScaleY;
	}
	constructor(entity:Entity, template:ColliderTemplate = {}) {
		super(entity);
		const transform = entity.getComponent(Transform2D);
		if(transform) {
			this._transform = transform;
		}
		this._rect = new Rect(0, 0, 128, 128);

		this.parseTemplate(template);
	}

	public parseTemplate(template: ColliderTemplate) {
		if (template.rect) {
			this._rect.parseTemplate(template.rect);
		}
	}

	public contains(point: PointTemplate): boolean {
		if (point.x >= this.x && point.x <= this.x + this.w &&
			point.y >= this.y && point.y <= this.y + this.h) {
			return true;
		}
		return false;
	}
}
ComponentFactory.register(Collider, 'onodrim.collider');
