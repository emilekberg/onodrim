export default class Time {
   public static update() {
        const now = performance.now();
        this._deltaTimeMS = now - this._lastUpdateTime;
        this._deltaTime = this._deltaTimeMS * 0.001;
        this._lastUpdateTime = now;
    }
    public static now():number {
        return performance.now()/1000;
    }
    public static setFixedUpdateTime(timestep:number) {
        this._deltaTime = timestep;
    }
    protected static _deltaTime:number = 0;
    protected static _deltaTimeMS:number = 0;
    protected static  _lastUpdateTime:number = performance.now();

    public static get deltaTime():number {
        return this._deltaTime;
    }
    public static get deltaTimeMS():number {
        return this._deltaTimeMS;
    }
    public static get FPS():number {
        return 1/this.deltaTime;
    }

}
