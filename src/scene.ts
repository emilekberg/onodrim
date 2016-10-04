import Entity from "./entity";
import RenderComponent from "./components/render-component";

export default class Scene {
    public static SCENES:Array<Scene> = [];
    public static CURRENT_SCENE:Scene = null;
    public static ChangeScene(scene:Scene) {
        if(this.CURRENT_SCENE !== null) {
            this.CURRENT_SCENE.changeFrom();
        }
        this.CURRENT_SCENE = scene;
        this.CURRENT_SCENE.changeTo();
    }

    public static AddScene(scene:Scene) {
        let id = this.SCENES.push(scene);
        if(this.CURRENT_SCENE == null) {
            this.CURRENT_SCENE = scene;
        }
        return id;
    }
    public entities:Array<Entity>;
    public renderers:Array<RenderComponent>;
    private _id:number;
    constructor() {
        this._id = Scene.AddScene(this);
        this.entities = new Array<Entity>();
        this.renderers = new Array<RenderComponent>();
    }

    public addEntity(entity:Entity) {
        this.entities.push(entity);
        let renderer = entity.getComponent(RenderComponent);
        if(renderer !== null) {
            this.renderers.push(renderer);
        }
    }

    public changeFrom() {
        // TODO: implement;
    }
    public changeTo() {
        // TODO: implement;
    }

    public fixedUpdate() {
        // TODO: implement;
    }
    public update() {
        // TODO: implement;
    }
}
