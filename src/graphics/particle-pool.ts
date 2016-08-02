import Particle from './particle'
export default class ParticlePool {
    static pool:{[id:string]:ParticlePool} = {};
    static createPool<T extends Particle>(particleType:{ new (...args:any[]):T}, count:number) {
        if (this.pool[particleType.name]) {
            return this.pool[particleType.name];
        }
        let pool = new ParticlePool();
        pool._setParticleType(particleType);
        pool._fillPool(count);
        this.pool[particleType.name] = pool;
        return pool;
    }
    protected _particleConstructor:{new (...args:any[]):Particle}; 
    protected _particles:Array<Particle>;
    constructor() {
        this._particles = new Array<Particle>();
        
    }

    protected _setParticleType<T extends Particle>(particleType:{ new (...args:any[]):T}) {
        this._particleConstructor = particleType;
    }

    protected _fillPool(count:number) {
        for(let i = 0; i < count; i++) {
            this._particles.push(new this._particleConstructor());
        }
    }

    requestParticle():Particle {
        let p = this._particles.shift();
        if (!p) {
            return new this._particleConstructor();
        }
        return p;
    }
    poolParticle(p:Particle) {
        this._particles.push(p);
    }
}