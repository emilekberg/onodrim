import Entity from '../entity';
import Transform2D from '../components/transform2d';
import ParticlePool from './particle-pool';
import Particle from './particle';
export const enum State {
	IDLE,
	STARTED,
	STOPPING,
	PAUSED
}
// TODO: make ParticleSystem be a component instead of an entity.
// TODO: ParticleSystem could use a good rewrite, it's a bit chaotic as of now...
export default class ParticleSystem extends Entity {
	public transform:Transform2D;
	public activeParticles:Particle[];
	protected _state:State;
	protected _maxParticles:number;
	protected _particleCount:number;
	protected _pool:ParticlePool;
	protected _particleConstructor:{new (...args:any[]):Particle};

	constructor() {
		super();
		this.transform = new Transform2D(this);
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
			for (const i = 0; i < this._particleCount;) {
					const particle = this.activeParticles.shift();
					if (!particle) {
						continue;
					}
					this._pool.poolParticle(particle);
			}
			this._particleCount = 0;
		}
	}
	public fixedUpdate():void {
		switch(this._state) {
			case State.STARTED:
				this.transform.setDirty();
				while(this._shouldFireParticle()) {
					this._fireParticle();
				}
				if(this._shouldStop()) {
						this._state = State.STOPPING;
				}
			case State.STOPPING:
				for(let i = 0; i < this._particleCount;) {
						const particle:Particle = this.activeParticles[i];
						if(particle.fixedUpdate()) {
						++i;
					}
					else {
						this._pool.poolParticle(particle);
						this.activeParticles.splice(this.activeParticles.indexOf(particle), 1);
						this.removeComponent(particle);
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
		const particle = this._pool.requestParticle(this);
		this._particleCount++;

		this.activeParticles.push(particle);
		this.addComponent(particle);
		this._initParticle(particle);
		particle.visible = true;
	}
	protected _initParticle(particle:Particle):void {
		particle.reset();
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
