import Entity from '../entity';
import ComponentFactory from './component-factory';
import SystemManager from '../system/system-manager';
export interface Template {
	type?: string;
}
export interface UpdateComponent extends Component {
	update: () => void;
	fixedUpdate: (compensated: boolean) => void;
}
export default class Component {
	protected _entity:Entity;
	protected _requiredComponents:Array<new () => Component>;
	constructor(entity:Entity) {
		this._requiredComponents = [];
		this.setEntity(entity);

		SystemManager.addComponentInstance(this);
	}

	public setEntity(entity:Entity):void {
		this._entity = entity;
		// this._checkRequiredComponents();
	}

	public getEntity():Entity {
		return this._entity;
	}

	/*private _checkRequiredComponents():void {
		for(let i = 0; i < this._requiredComponents.length; ++i) {
			if(!this._entity.hasComponent(this._requiredComponents[i])) {
					console.error(
						this._entity.constructor.name,
						'is missing required component',
						this._requiredComponents[i].name.toString()
					);
			}
		}
	}*/
}
ComponentFactory.register(Component);
