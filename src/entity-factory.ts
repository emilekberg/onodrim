import ComponentFactory from './components/component-factory';
import Entity, {EntityTemplate} from './entity';
export class EntityFactory {
    constructor() {
        // empty for now
    }

    public create(template: EntityTemplate): Entity {
        const components = template.components;
        const entity = new Entity();
        if (!components) {
            return entity;
        }

        components.forEach((value) => {
            const component = ComponentFactory.create(entity, value);
            if(component) {
                entity.addComponent(component);
            }
        });
        return entity;
    }
}
const entityFactory = new EntityFactory();
export default entityFactory;
