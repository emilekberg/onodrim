import System from './system';
export class SystemManager {
    protected _systems:System[];
    constructor() {
        this._systems = new Array<System>();
    }

    public addSystem(system:System) {
        this._systems.push(system);
    }

    public hasSystem(systemType:Function):boolean {
        for(let i = 0; i < this._systems.length; ++i) {
            if(this._systems[i] instanceof (systemType)) {
                return true;
            }
        }
        return false;
    }

    public getSystem<T extends System>(systemType:{ new (...args:any[]):T;}):T|null {
        for(let i = 0; i < this._systems.length; ++i) {
            if(this._systems[i] instanceof (systemType)) {
                return this._systems[i] as T;
            }
        }
        return null;
    }

    public getAllSystems():System[] {
        return this._systems;
    }
}
const systemManager = new SystemManager();
export default systemManager;
