import ComponentFactory from './components/component-factory';
import Entity, {EntityTemplate} from './entity';
export default class EntityFactory {
	public static create(template: EntityTemplate): Entity {
		const entity = new Entity();
		this.parseTemplate(entity, template);
		return entity;
	}

	public static parseTemplate(entity: Entity, template: EntityTemplate): void {
		if (template.name) {
			entity.name = template.name;
		}
		if (!template.components) {
			return;
		}
		template.components.forEach((value) => {
			ComponentFactory.create(entity, value);
		});
	}
}
