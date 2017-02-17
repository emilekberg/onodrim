import ComponentFactory from './components/component-factory';
import Entity, {EntityTemplate} from './entity';
export class EntityFactory {
    constructor() {
        // empty for now
    }

    public create(template: EntityTemplate): Entity {
        const entity = new Entity();
        this.parseTemplate(entity, template);
        return entity;
    }

    public parseTemplate(entity: Entity, template: EntityTemplate): void {
        if (template.name) {
            entity.name = template.name;
        }
        if (!template.components) {
            return;
        }
        template.components.forEach((value) => {
            const component = ComponentFactory.create(entity, value);
        });
    }
}
const entityFactory = new EntityFactory();
export default entityFactory;
