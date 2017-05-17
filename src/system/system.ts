import Component from '../components/component';
export interface TickSystem<T extends Component> extends System<T> {
	tick(): void;
}
export abstract class System<T extends Component> {
	protected _components: T[];
	constructor() {
		this._components = [];
	}

	public canProcessComponent(component: Component): boolean {
		return false;
	}

	public addComponentInstance(component:T) {
		const index = this._components.indexOf(component);
		if (index === -1) {
			this._components.push(component);
		}
	}

	public removeComponentInstance(component:T):void {
		const index = this._components.indexOf(component);
		if (index !== -1) {
			this._components.splice(index, 1);
		}
	}
}
export default System;
