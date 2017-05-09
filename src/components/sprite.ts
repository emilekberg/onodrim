import ComponentFactory from './component-factory';
import RenderComponent, {RenderComponentTemplate} from './render-component';
import Entity from '../entity';
import Texture, {TextureTemplate} from '../resources/texture';
import Point, {PointTemplate} from '../math/point';
import WebGLSystem from '../system/webgl/webgl-system';
import SpriteBatch from '../system/webgl/batching/sprite-batch';
import {Value} from '../math/matrix3';
import Transform2D from '../components/transform2d';

export interface SpriteTemplate extends RenderComponentTemplate {
	texture: TextureTemplate|Texture;
	x?: number;
	y?: number;
	offset?: PointTemplate;
}
export default class Sprite extends RenderComponent {
	public x:number;
	public y:number;
	protected _w:number;
	protected _h:number;

	protected _offset:Point;
	protected _texture: Texture;

	get texture():Texture {
		return this._texture;
	}

	set offset(value:Point) {
		this._offset = value;
	}
	get offset():Point {
		return this._offset;
	}
	get width():number {
		return this._w * this._renderedMatrix.values[Value.a];
	}
	get height():number {
		return this._h * this._renderedMatrix.values[Value.d];
	}
	constructor(entity:Entity, template:SpriteTemplate) {
		super(entity, template);
		this.x = template.x || 0;
		this.y = template.y || 0;
		this._offset = new Point();
		if (template.offset) {
			this._offset.set(template.offset.x, template.offset.y);
		}
		this._w = 0;
		this._h = 0;
		if(template.texture) {
			let texture: Texture;
			if (template.texture instanceof Texture) {
				texture = template.texture;
			}
			else {
				texture = new Texture(template.texture);
			}
			this.setTexture(texture);
		}
		// this.reset();
	}

	/**
	 * TODO: Check if this is too slow. This is a solution to the texture scaling problem
	 * Might be faster to upload size to GPU
	 */
	public updateTransform()
	{
		if (this._transform.wasDirty) {
			this._renderState.matrix
				.identity()
				.scale(this._texture.rect.w * 0.5, this._texture.rect.h * 0.5)
				.multiply(this._transform.worldMatrix)
				.translate(this.x, this.y);
		}
	}

	public setTexture(texture:Texture) {
		this._texture = texture;
		this._w = this._texture.image.width;
		this._h = this._texture.image.height;
	}

	public render(delta:number, gl:WebGL2RenderingContext, batch:SpriteBatch) {
		this.interpolateRenderMatrix(delta);
		batch.render(this._renderedMatrix, this.texture, this.texture.glRect, this._color);
	}
}
ComponentFactory.register(Sprite, 'onodrim.sprite');
