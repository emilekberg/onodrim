import RenderComponent from './render-component'
import TransformComponent from './transform-component'
import Entity from '../entity'
import Texture from '../resources/texture'
import Point from '../math/point'
export default class SpriteComponent extends RenderComponent {
    protected _texture: Texture;
    x:number;
    y:number;
    protected _w:number;
    protected _h:number;

    protected _offset:Point;

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
        return this._w * this._renderedMatrix.a;
    }
    get height():number {
        return this._h * this._renderedMatrix.d;
    }
    constructor(entity:Entity) {
        super(entity);
        this.x = 0;
        this.y = 0;
        this._w = 0;
        this._h = 0;
        this._offset = new Point();
    }

    setTexture(texture:Texture) {
        this._texture = texture;
        this._w = this._texture.image.width;
        this._w = this._texture.image.height;
    }

    render(delta:number, ctx:CanvasRenderingContext2D) {
        if (!this.isVisible()) {
            return;
        }
        this.interpolateRenderMatrix(delta, ctx);
        ctx.drawImage(
            this._texture.image, 
            this._texture.rect.x, 
            this._texture.rect.y, 
            this._texture.rect.w, 
            this._texture.rect.h, 
            -this._texture.rect.w*this._offset.x, 
            -this._texture.rect.h*this._offset.y, 
            this._texture.rect.w, 
            this._texture.rect.h
        );
        this.requireDepthSort = false;
    }
}