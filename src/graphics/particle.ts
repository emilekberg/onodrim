import Entity from '../entity'
import TransformComponent from '../components/transform-component'
import SpriteComponent from '../components/sprite-component'
import RenderComponent from '../components/render-component'
export default class Particle extends Entity {
    transform:TransformComponent;
    renderComponent:RenderComponent;
    constructor() {
        super();
        this.transform = new TransformComponent(this);
        this.addComponent(this.transform);
        this.createRenderer();
    }

    createRenderer() {
        this.renderComponent = new SpriteComponent(this);
        this.addComponent(this.renderComponent);
    }

    reset(owner) {
        this.init(owner);
        this.renderComponent.reset();
    }

    init(owner) {
        this.transform.x = 400;
        this.transform.y = 200;
    }

    fixedUpdate():boolean {
        return this._isAlive();
    }

    protected _isAlive():boolean {
        return true;
    }
}