import Component, {Template} from './component';
import Entity from '../entity';
export class ComponentFactory {
    protected _componentTypes: {[key: string]: { new (...args:any[]):Component;}};
    constructor() {
        this._componentTypes = {};
    }

    public register<T extends Component>(componentType:{ new (...args:any[]):T;}, name?: string):void {
        this._componentTypes[name || componentType.name] = componentType;
    }

    public create(entity: Entity, template: Template): Component|null {
        if (!template.type) {
            return null;
        }
        const componentType = this._componentTypes[template.type];
        const component = new componentType(entity, template);
        entity.addComponent(component);
        return component;
    }
}
const componentFactory = new ComponentFactory();
export default componentFactory;
