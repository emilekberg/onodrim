import {Graphics, Time, Components, Resources} from "onodrim";
import * as Onodrim from "onodrim";
const fireRate:number = 0.05;
export default class ParticleSystem extends Graphics.ParticleSystem {
    public delta:number;
    private _timer: number;
    private _particlesLeft:number;
    constructor() {
        super();
        this._particlesLeft = 100000;
        this._timer = 0;
    }
    public fixedUpdate() {
        super.fixedUpdate();
        this._timer += Time.deltaTime;
    }
    protected _shouldFireParticle() {
        return this._timer >= fireRate && this._particlesLeft > 0;
    }
    protected _fireParticle() {
        super._fireParticle();
        this._timer-=fireRate;
        this._particlesLeft--;
    }
    protected _shouldStop():boolean {
        return this._particlesLeft <= 0;
    }
    protected _setParticleType() {
        this._particleConstructor = Particle;
    }
}

const lifeTime = 2;
class Particle extends Graphics.Particle {
    public velocity: Onodrim.Math.Vector2;
    public time: number;
    public sprite:Components.SpriteComponent;
    constructor() {
        super();
        this.sprite = this.renderComponent as Components.SpriteComponent;
        this.sprite.setTexture(new Resources.Texture("assets/square.png"));
        this.sprite.offset.x = this.sprite.offset.y = 0.5;
        this.transform.scale = new Onodrim.Math.Point(0.025, 0.025);
        this.velocity = new Onodrim.Math.Vector2(0, 0);
    }

    public init(owner: Graphics.ParticleSystem) {
        super.init(owner);
        let dir = (Math.random()*Math.PI*2);
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

    protected _isAlive(): boolean {
        return (this.time < lifeTime);
    }
}
