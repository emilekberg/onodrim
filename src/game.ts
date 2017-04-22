import Entity from './entity';
// import SystemManager from './system/system-manager';
// import RenderSystem from './system/render-system';
export default class Game {
	public entities:Entity[];
	constructor() {
		this.entities = [];
	}

	public addEntity(entity:Entity) {
		this.entities.push(entity);
		entity.addedToWorld();
	}

	public getEntity(name: string): Entity|undefined {
		const found = this.entities.find((entity) => {
			return entity.name === name;
		});
		return found;
	}

	public removeEntity(entity:Entity) {
		const index = this.entities.indexOf(entity);
		if (index !== -1) {
			this.entities.splice(index, 1);
			entity.removedFromWorld();
		}
		return;
	}

	public start():void {
		// implement
	}
}
