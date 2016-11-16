import Particle from "./particle";
export default class ParticlePool {
    public static pool:{[id:string]:ParticlePool} = {};
    public static createPool<T extends Particle>(particleType:{ new (...args:any[]):T}, count:number) {
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

    public requestParticle():Particle {
        let p = this._particles.shift();
        if (!p) {
            return new this._particleConstructor();
        }
        return p;
    }
    public poolParticle(p:Particle) {
        this._particles.push(p);
    }

    protected _setParticleType<T extends Particle>(particleType:{ new (...args:any[]):T}) {
        this._particleConstructor = particleType;
    }

    protected _fillPool(count:number) {
        for(let i = 0; i < count; ++i) {
            this._particles.push(new this._particleConstructor());
        }
    }
}
