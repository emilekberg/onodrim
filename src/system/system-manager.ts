import System from './system';
import Component from '../components/component';
export class SystemManager {
    protected _systems: Array<System<Component>>;
    constructor() {
        this._systems = [];
    }

    public addSystem(system: System<Component>) {
        this._systems.push(system);
    }

    public hasSystem<T extends System<Component>>(systemType:{ new (...args:any[]):T;}):boolean {
        for(let i = 0; i < this._systems.length; ++i) {
            if(this._systems[i] instanceof (systemType)) {
                return true;
            }
        }
        return false;
    }

    public getSystem<T extends System<Component>>(systemType:{ new (...args:any[]):T;}):T|null {
        for(let i = 0; i < this._systems.length; ++i) {
            if(this._systems[i] instanceof (systemType)) {
                return this._systems[i] as T;
            }
        }
        return null;
    }

    public getAllSystems():Array<System<Component>> {
        return this._systems;
    }
}
const systemManager = new SystemManager();
export default systemManager;
