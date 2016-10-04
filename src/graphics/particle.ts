import Entity from "../entity";
import TransformComponent from "../components/transform-component";
import SpriteComponent from "../components/sprite-component";
import RenderComponent from "../components/render-component";
export default class Particle extends Entity {
    public transform:TransformComponent;
    public renderComponent:RenderComponent;
    constructor() {
        super();
        this.transform = new TransformComponent(this);
        this.addComponent(this.transform);
        this.createRenderer();
    }

    public createRenderer() {
        this.renderComponent = new SpriteComponent(this);
        this.addComponent(this.renderComponent);
    }

    public reset(owner) {
        this.init(owner);
        this.renderComponent.reset();
    }

    public init(owner) {
        this.transform.x = 400;
        this.transform.y = 200;
    }

    public fixedUpdate():boolean {
        return this._isAlive();
    }

    protected _isAlive():boolean {
        return true;
    }
}
