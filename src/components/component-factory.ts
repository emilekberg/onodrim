import Component, {Template} from './component';
import Entity from '../entity';
export default class ComponentFactory {
	public static register<T extends Component>(componentType:{ new (...args:any[]):T;}, name?: string):void {
		this._componentTypes[name || componentType.name] = componentType;
	}

	public static create(entity: Entity, template: Template): Component|null {
		if (!template.type) {
			return null;
		}
		const componentType = this._componentTypes[template.type];
		const component = new componentType(entity, template);
		entity.addComponent(component);
		return component;
	}

	protected static _componentTypes: {[key: string]: { new (...args:any[]):Component;}} = {};
}
