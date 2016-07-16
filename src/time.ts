export default class Time {
    protected static _deltaTime:number = 0;
    protected static _deltaTimeMS:number = 0;
    protected static _lastUpdateTime:number = performance.now();
    static update() {
        let now = performance.now();
        this._deltaTimeMS = now - this._lastUpdateTime;
        this._deltaTime = this._deltaTimeMS * 0.001;
        this._lastUpdateTime = now;
    }
    static now():number {
        return performance.now()/1000;
    }
    static get deltaTime():number {
        return this._deltaTime;
    }
    static get deltaTimeMS():number {
        return this._deltaTimeMS;
    }
    static get FPS():number {
        return 1/this.deltaTime;
    }
    static setFixedUpdateTime(timestep:number) {
        this._deltaTime = timestep;
    }
}