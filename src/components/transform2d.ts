// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/display/DisplayObject.js
import ComponentFactory from './component-factory';
import Point, {PointTemplate} from '../math/point';
import Entity, {EntityTemplate} from '../entity';
import Transform, {TransformTemplate} from './transform';
import Vector2 from '../math/vector2';
import Matrix3 from '../math/matrix3';
import EntityFactory from '../entity-factory';

export interface Transform2DTemplate extends TransformTemplate {
	position?:PointTemplate;
	scale?:PointTemplate;
	origo?:PointTemplate;
	rotation?:number;
	children?:EntityTemplate[];
}

export default class Transform2D extends Transform {
	public wasDirty:boolean;
	public worldMatrix:Matrix3;
	protected _position:Vector2;
	protected _origo:Vector2;
	protected _scale:Vector2;
	protected _rotation:number;
	protected _rotationCache:number;
	protected _cr:number;
	protected _sr:number;
	protected _isDirty:boolean;
	private _localMatrix:Matrix3;

	get parent():Transform2D {
		return this._parent as Transform2D;
	}
	get entity():Entity {
		return this._entity;
	}
	get position():Vector2 {
		return this._position;
	}
	set position(value:Vector2) {
		this._position = value;
		this.setDirty();
	}
	get x():number {
		return this._position.x;
	}
	set x(value:number) {
		this._position.x = value;
		this.setDirty();
	}
	get y():number {
		return this._position.y;
	}
	set y(value:number) {
		this._position.y = value;
		this.setDirty();
	}
	get scale():Vector2 {
		return this._scale;
	}
	set scale(value:Vector2) {
		this._scale = value;
		this.setDirty();
	}
	get scaleX():number {
		return this._scale.x;
	}
	set scaleX(value:number) {
		this._scale.x = value;
		this.setDirty();
	}
	get scaleY():number {
		return this._scale.y;
	}
	set scaleY(value:number) {
		this._scale.y = value;
		this.setDirty();
	}
	get origo():Vector2 {
		return this._origo;
	}
	set origo(value:Vector2) {
		this._origo = value;
		this.setDirty();
	}
	set rotation(value:number) {
		this._rotation = value;
		this.setDirty();
	}
	get rotation():number {
		return this._rotation;
	}

	get worldX():number {
		return this.worldMatrix.values[6];
	}
	get worldY():number {
		return this.worldMatrix.values[7];
	}
	get worldScaleX():number {
		return Math.sqrt(Math.pow(this.worldMatrix.values[0],2)+Math.pow(this.worldMatrix.values[1],2));
	}
	get worldScaleY():number {
		return Math.sqrt(Math.pow(this.worldMatrix.values[3],2)+Math.pow(this.worldMatrix.values[4],2));
	}
	get worldRotation():number {
		return Math.atan2(this.worldMatrix.values[3], this.worldMatrix.values[0]);
	}

	get isDirty():boolean {
		return this._isDirty;
	}
	constructor(entity:Entity, template:Transform2DTemplate = {}) {
		super(entity, template);
		this._position = new Vector2(0,0);
		this._origo = new Vector2(0,0);
		this._scale = new Vector2(1,1);
		this._rotation = 0;
		this._rotationCache = 0;
		this._parent = null;
		this._cr = 1;
		this._sr = 0;
		this._localMatrix = new Matrix3();
		this.worldMatrix = new Matrix3();
		this._isDirty = true;
		this.wasDirty = true;
		this.parseTemplate(template);
	}

	public parseTemplate(template: Transform2DTemplate) {
		if(template.position) {
			this._position.parseTemplate(template.position);
		}
		if(template.scale) {
			this._scale.parseTemplate(template.scale);
		}
		if(template.origo) {
			this._origo.parseTemplate(template.origo);
		}
		if(template.children) {
			// Not 100% sure about this position here. might want to check this at another place.
			template.children.forEach((child) => {
				const childEntity = EntityFactory.create(child);
				this.addChildEntity(childEntity);
			});
		}
		if(template.rotation) {
			this._rotation = template.rotation;
		}
		this._isDirty = true;
		this.wasDirty = true;
	}

	public fixedUpdate(compensated: boolean) {
		if(this.parent && this.parent.wasDirty) {
			this._isDirty = true;
		}
		if(this._isDirty) {
			this._localMatrix.identity()
				.rotate(this._rotation)
				.scale(this._scale.x, this.scale.y)
				.translate(this.position.x, this.position.y);
			this.worldMatrix.copy(this._localMatrix);
			if(this.parent) {
				this.worldMatrix.multiply(this.parent.worldMatrix);
			}
		}
		this.wasDirty = compensated && this.wasDirty ? this.wasDirty : this._isDirty;
		this._isDirty = false;
	}

	public setDirty() {
		this._isDirty = true;
	}

	public addChildEntity(entity: Entity) {
		const transform = entity.getComponent(Transform2D);
		if (!transform) {
			return;
		}
		this.addChild(transform);
	}
}
ComponentFactory.register(Transform2D, 'onodrim.transform2d');
