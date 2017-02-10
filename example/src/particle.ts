import {Graphics, Time, Components, Resources} from 'onodrim';
import * as Onodrim from 'onodrim';
const lifeTime = 4;
export default class Particle extends Graphics.Particle {
    public velocity: Onodrim.Math.Vector2;
    public time: number;
    public sprite:Components.Sprite;
    constructor() {
        super();
        this.sprite = this.renderComponent as Components.Sprite;
        this.sprite.offset.x = this.sprite.offset.y = 0.5;
        this.transform.scale = new Onodrim.Math.Point(0.025, 0.025);
        this.velocity = new Onodrim.Math.Vector2(0, 0);
    }

    public init(owner: Graphics.ParticleSystem) {
        super.init(owner);
        const dir = (Math.random()*Math.PI*2);
        this.velocity.x = Math.cos(dir);
        this.velocity.y = Math.sin(dir);
        this.time = 0;

    }

    public fixedUpdate(): boolean {
        this.transform.x += this.velocity.x;
        this.transform.y += this.velocity.y;
        this.velocity.y += Time.deltaTime;
        this.time += Time.deltaTime;
        this.sprite.alpha = 1 - (this.time / lifeTime);
        return super.fixedUpdate();
    }

    public createRenderer() {
        // this needs to be overriden
        this.renderComponent = new Components.Sprite(this, {
            texture: new Resources.Texture('assets/square.png')
        });
        // this.addComponent(this.renderComponent);
    }

    protected _isAlive(): boolean {
        return (this.time < lifeTime);
    }

}
