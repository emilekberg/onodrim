import {Graphics, Time} from 'onodrim';
import * as Onodrim from 'onodrim';
import Particle from './particle';
const fireRate:number = 0.001;
export default class ParticleSystem extends Graphics.ParticleSystem {
    public delta:number;
    private _timer: number;
    private _particlesLeft:number;
    constructor() {
        super();
        this._particlesLeft = 1000000;
        this._maxParticles = 10000000000000;
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
        return false; // this._particlesLeft <= 0;
    }
    protected _setParticleType() {
        this._particleConstructor = Particle;
    }
}
