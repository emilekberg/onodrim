import RenderComponent from './render-component'
import TransformComponent from './transform-component'
import Entity from '../entity'
export default class SpriteComponent extends RenderComponent {
    public texture: string;
    constructor(entity:Entity) {
        super(entity);
    }


    fixedUpdate() {

    }
    render(delta:number, ctx:CanvasRenderingContext2D) {
        super.render(delta, ctx);
    }
}