import RenderComponent from './render-component'
import TransformComponent from './transform-component'
import Entity from '../entity'
import Texture from '../resources/texture'
export default class SpriteComponent extends RenderComponent {
    texture: Texture;
    _x:number;
    _y:number;
    _w:number;
    _h:number;
    constructor(entity:Entity) {
        super(entity);
        this._x = 0;
        this._y = 0;
        this._w = 0;
        this._h = 0;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    render(delta:number, ctx:CanvasRenderingContext2D) {
        super.render(delta, ctx);
        ctx.drawImage(this.texture.image, this._x, this._y);
    }
}