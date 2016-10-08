export class Time {
    protected _deltaTime:number = 0;
    protected _deltaTimeMS:number = 0;
    protected _lastUpdateTime:number = performance.now();
    public update() {
        let now = performance.now();
        this._deltaTimeMS = now - this._lastUpdateTime;
        this._deltaTime = this._deltaTimeMS * 0.001;
        this._lastUpdateTime = now;
    }
    public now():number {
        return performance.now()/1000;
    }
    public get deltaTime():number {
        return this._deltaTime;
    }
    public get deltaTimeMS():number {
        return this._deltaTimeMS;
    }
    public get FPS():number {
        return 1/this.deltaTime;
    }
    public setFixedUpdateTime(timestep:number) {
        this._deltaTime = timestep;
    }
}
const time = new Time();
export default time;
