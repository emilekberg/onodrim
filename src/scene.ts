import Entity from './entity'
import RenderComponent from './components/render-component'
export default class Scene {
    static Scenes:Array<Scene> = [];
    static CurrentScene:Scene = null;
    static ChangeScene(scene:Scene) {
        if (this.CurrentScene !== null) {
            this.CurrentScene.changeFrom();        
        }
        this.CurrentScene = scene;
        this.CurrentScene.changeTo();
    }
    static AddScene(scene:Scene) {
        let id = this.Scenes.push(scene);
        if(this.CurrentScene == null) {
            this.CurrentScene = scene;
        }
        return id;
    }
    entities:Array<Entity>;
    renderers:Array<RenderComponent>;
    private _id:number;
    constructor() {
        this._id = Scene.AddScene(this);
        this.entities = new Array<Entity>();
        this.renderers = new Array<RenderComponent>();
    }

    addEntity(entity:Entity) {
        this.entities.push(entity);
        let renderer = entity.getComponent<RenderComponent>(RenderComponent);
        if (renderer !== null) {
            this.renderers.push(renderer);
        }
    }

    changeFrom() {

    }
    changeTo() {

    }

    fixedUpdate() {

    }
    update() {
        
    }
}