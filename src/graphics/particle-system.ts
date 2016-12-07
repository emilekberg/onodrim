import Entity from '../entity';
import Transform2DComponent from '../components/transform2d-component';
import ParticlePool from './particle-pool';
import Particle from './particle';
export const enum State {
    IDLE,
    STARTED,
    STOPPING,
    PAUSED
}
export default class ParticleSystem extends Entity {
    public transform:Transform2DComponent;
    public activeParticles:Particle[];
    protected _state:State;
    protected _maxParticles:number;
    protected _particleCount:number;
    protected _pool:ParticlePool;
    protected _particleConstructor:{new (...args:any[]):Particle};

    constructor() {
        super();
        this.transform = new Transform2DComponent(this);
        this.addComponent(this.transform);

        this.activeParticles = new Array<Particle>();
        this._particleCount = 0;
        this._maxParticles = 100;
        this._setParticleType();
        this._createPool(0);
    }

    public init():void {
        // TODO: implement
    }
    public start():void {
        this._state = State.STARTED;
    }
    public stop(immediately:boolean):void {
        this._state = State.STOPPING;
        if (immediately) {
            this._state = State.IDLE;
            for (let i = 0; i < this._particleCount;) {
                this._pool.poolParticle(this.activeParticles.shift());
            }
            this._particleCount = 0;
        }
    }
    public fixedUpdate():void {
        switch(this._state) {
            case State.STARTED:
                while(this._shouldFireParticle()) {
                    this._fireParticle();
                }
                if(this._shouldStop()) {
                    this._state = State.STOPPING;
                }
            case State.STOPPING:
                for(let i = 0; i < this._particleCount;) {
                    let particle:Particle = this.activeParticles[i];

                    if(particle.fixedUpdate()) {
                        ++i;
                    }
                    else {
                        this._pool.poolParticle(particle);
                        this.activeParticles.splice(this.activeParticles.indexOf(particle), 1);
                        this._particleCount--;
                    }

                }
                if(!this._isAlive()) {
                    this._state = State.IDLE;
                }
                break;
            default:
                break;
        }
    }
    protected _fireParticle():void {
        let particle: Particle;
        if(this._particleCount >= this._maxParticles) {
            this._pool.poolParticle(this.activeParticles.shift());
            particle = this._pool.requestParticle();
        }
        else {
            particle = this._pool.requestParticle();
            this._particleCount++;

        }
        this.activeParticles.push(particle);
        this._initParticle(particle);
        particle.renderComponent.visible = true;
    }
    protected _initParticle(particle:Particle):void {
        particle.reset(this);
    }
    protected _shouldFireParticle():boolean {
        return this._particleCount < this._maxParticles;
    }
    protected _isAlive():boolean {
        return (this._state === State.STARTED || this._state === State.STOPPING);
    }
    protected _shouldStop():boolean {
        return false;
    }
    protected _createPool(count:number):void {
        this._pool = ParticlePool.createPool(this._particleConstructor, count);
    }
    protected _setParticleType() {
        this._particleConstructor = Particle;
    }
}
