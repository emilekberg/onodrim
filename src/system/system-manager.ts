import System, { TickSystem } from './system';
import Component from '../components/component';

export class SystemManager {
	protected _systems: Array<System<Component>>;
	protected _tickSystems: Array<TickSystem<Component>>;
	constructor() {
		this._systems = [];
		this._tickSystems = [];
	}

	public addComponentInstance(component: Component) {
		const l = this._systems.length;
		for(let i = 0; i < l; ++i) {
			const system = this._systems[i];
			if(system.canProcessComponent(component)) {
				system.addComponentInstance(component);
		}
		}
	}

	public addSystem(system: System<Component>) {
		this._systems.push(system);
		if ((system as TickSystem<Component>).tick) {
			this._tickSystems.push(system as TickSystem<Component>);
		}
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

	public tick() {
		const l = this._tickSystems.length;
		for(let i = 0; i < l; ++i) {
			this._tickSystems[i].tick();
		}
	}
}
const systemManager = new SystemManager();
export default systemManager;
