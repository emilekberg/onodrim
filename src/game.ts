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

    public removeEntity(entity:Entity) {
        let index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            entity.removedFromWorld();
        }
        return;
    }

    public start():void {
        // implement
    }

    public end():void {
        // implement
    }

    public update() {
        // free fps update
    }

    public fixedUpdate() {
        // 30 fps update
    }

    public render() {
        // render
    }
}
