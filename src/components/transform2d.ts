// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/display/DisplayObject.js
import ComponentFactory from './component-factory';
import Point, {PointTemplate} from '../math/point';
import Entity from '../entity';
import Transform, {TransformTemplate} from './transform';
import Vector2 from '../math/vector2';
import Matrix3 from '../math/matrix3';

export interface Transform2DTemplate extends TransformTemplate {
	position?:PointTemplate;
	scale?:PointTemplate;
	origo?:PointTemplate;
	rotation?:number;
}

const enum ParentCache {
	x,
	y,
	scaleX,
	scaleY,
	rotation
}

export default class Transform2D extends Transform {
	public wasDirty:boolean;
	public worldMatrix:Matrix3;
	protected _position:Point;
	protected _origo:Point;
	protected _scale:Point;
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
	get position():Point {
		return this._position;
	}
	set position(value:Point) {
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
	get scale():Point {
		return this._scale;
	}
	set scale(value:Point) {
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
	get origo():Point {
		return this._origo;
	}
	set origo(value:Point) {
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
		this._position = template.position ? Vector2.fromTemplate(template.position) : new Vector2(0,0);
		this._origo = template.origo ? Vector2.fromTemplate(template.origo) : new Vector2(0,0);
		this._scale = template.scale ? Vector2.fromTemplate(template.scale) : new Vector2(1,1);
		this._rotation = template.rotation || 0;
		this._rotationCache = 0;
		this._parent = null;
		this._cr = 1;
		this._sr = 0;
		this._localMatrix = new Matrix3();
		this.worldMatrix = new Matrix3();
		this._isDirty = true;
		this.wasDirty = true;
	}

	public fixedUpdate() {
		if(this.parent && this.parent.wasDirty) {
			this._isDirty = true;
		}
		if(this._isDirty) {
			this._localMatrix.identity()
				.rotate(this._rotation)
				.scale(this._scale.x,this.scale.y)
				.translate(this.position.x, this.position.y);
			this.worldMatrix.copy(this._localMatrix);
			if(this.parent) {
				this.worldMatrix.multiply(this.parent.worldMatrix);
			}
		}
		this.wasDirty = this._isDirty;
		this._isDirty = false;
	}

	public setDirty() {
		this._isDirty = true;
	}
}
ComponentFactory.register(Transform2D, 'onodrim.transform2d');
