import Entity from "../entity";
import Transform2DComponent from "../components/transform2d-component";
import SpriteComponent from "../components/sprite-component";
import RenderComponent from "../components/render-component";
import ParticleSystem from "./particle-system";
export default class Particle extends Entity {
    public transform:Transform2DComponent;
    public renderComponent:RenderComponent;
    constructor() {
        super();
        this.transform = new Transform2DComponent(this);
        this.addComponent(this.transform);
        this.createRenderer();
    }

    public createRenderer() {
        this.renderComponent = new SpriteComponent(this);
        this.addComponent(this.renderComponent);
    }

    public reset(owner:ParticleSystem) {
        this.init(owner);
        this.renderComponent.reset();
    }

    public init(owner:ParticleSystem) {
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
