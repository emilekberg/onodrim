import RenderComponent from './render-component'
import TransformComponent from './transform-component'
import Entity from '../entity'
import Texture from '../resources/texture'
export default class SpriteComponent extends RenderComponent {
    protected _texture: Texture;
    protected _x:number;
    protected _y:number;
    protected _w:number;
    protected _h:number;
    constructor(entity:Entity) {
        super(entity);
        this._x = 0;
        this._y = 0;
        this._w = 0;
        this._h = 0;
    }

    setTexture(texture:Texture) {
        this._texture = texture;
        this._w = this._texture.image.width;
        this._w = this._texture.image.height;
    }

    render(delta:number, ctx:CanvasRenderingContext2D):boolean {
        if (!super.render(delta, ctx)) {
            return false;
        }
        ctx.drawImage(this._texture.image, this._x, this._y);
        return true;
    }
}