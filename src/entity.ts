import Component, {Template, UpdateComponent } from './components/component';
import EntityFactory from './entity-factory';
export interface EntityTemplate {
	name?: string;
	components?: any[];
}
export default class Entity {
	private static ENTITIES_CREATED: number = 0;
	public get name(): string {
		return this._name;
	}
	public set name(name: string) {
		this._name = name;
	}

	public get id(): number {
		return this._id;
	}

	protected _id:number;
	protected _components:Component[];
	protected _name:string;
	protected _isInWorld:boolean;

	constructor(template?: EntityTemplate) {
		this._id = Entity.ENTITIES_CREATED++;
		this._name = 'entity' + this._id;
		this._components = [];
		this._isInWorld = false;
		if (template) {
			EntityFactory.parseTemplate(this, template);
		}
	}

	public addedToWorld() {
		this._isInWorld = true;
	}

	public removedFromWorld() {
		this._isInWorld = false;
	}

	public isInWorld():boolean {
		return this._isInWorld;
	}

	public addComponent(component:Component) {
		component.setEntity(this);
		this._components.push(component);
	}

	public removeComponent(component: Component) {
		const index = this._components.indexOf(component);
		if (index > -1) {
			this._components.splice(index, 1);
		}
	}

	public hasComponent<T extends Component>(componentType:{ new (...args:any[]):T;}):boolean {
		for(let i = 0; i < this._components.length; ++i) {
			if(this._components[i] instanceof (componentType)) {
					return true;
			}
		}
		return false;
	}

	public getComponent<T extends Component>(componentType:{ new (...args:any[]):T;}):T|null {
		for(let i = 0; i < this._components.length; ++i) {
			if(this._components[i] instanceof (componentType)) {
					return this._components[i] as T;
			}
		}
		return null;
	}

	public getComponents<T extends Component>(componentType:{ new (...args:any[]):T;}):T[] {
		const components = new Array<T>();
		for(let i = 0; i < this._components.length; ++i) {
			if(this._components[i] instanceof (componentType)) {
					components.push(this._components[i] as T);
			}
		}
		return components;
	}

	public getAllComponents():Component[] {
		return this._components;
	}
}
