import RenderComponent from './render-component'
import TransformComponent from './transform-component'
import Entity from '../entity'
import Texture from '../resources/texture'
export default class SpriteComponent extends RenderComponent {
    protected _texture: Texture;
    x:number;
    y:number;
    protected _w:number;
    protected _h:number;

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
        super.render(delta, ctx);
        ctx.drawImage(this._texture.image, this.x, this.y);
    }
}