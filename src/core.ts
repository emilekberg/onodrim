import Entity from "./entity";
import Renderer from "./systems/renderer";
import Scene from "./scene";
import Time from "./time";

export default class Core {
    public static ENTITIES: Array<Entity> = [];
    public renderer: Renderer;
    public currentFixedUpdateTime: number;
    public nextFixedUpdateTime: number;
    public fixedUpdateTime: number;

    constructor() {
        this.fixedUpdateTime = 1/30;
        this.currentFixedUpdateTime = Time.now();
        this.nextFixedUpdateTime = 0;

        this.renderer = new Renderer();
        this.tick = this.tick.bind(this);
    }

    public start() {
        if(Scene.CURRENT_SCENE === null) {
            Scene.AddScene(new Scene());
        }
        requestAnimationFrame(this.tick);
    }

    public tick() {
        while(Time.now() >= this.nextFixedUpdateTime) {
            Time.setFixedUpdateTime(this.fixedUpdateTime);
            this._fixedUpdate();
            this.nextFixedUpdateTime += this.fixedUpdateTime;
        }
        Time.update();
        this._update();
        this._render();
        requestAnimationFrame(this.tick);
    }

    protected _fixedUpdate() {
        Scene.CURRENT_SCENE.fixedUpdate();
        for(let i = 0; i < Scene.CURRENT_SCENE.entities.length; i++) {
            Scene.CURRENT_SCENE.entities[i].fixedUpdate();
            let components = Scene.CURRENT_SCENE.entities[i].getAllComponents();
            for(let i = 0; i < components.length; i++) {
                components[i].fixedUpdate();
            }
        }
    }

    protected _update() {
        Scene.CURRENT_SCENE.update();
        for(let i = 0; i < Scene.CURRENT_SCENE.entities.length; i++) {
            Scene.CURRENT_SCENE.entities[i].update();
            let components = Scene.CURRENT_SCENE.entities[i].getAllComponents();
            for(let i = 0; i < components.length; i++) {
                components[i].update();
            }
        }
    }

    protected _render() {
        let delta = (this.nextFixedUpdateTime-Time.now())/this.fixedUpdateTime;
        this.renderer.render(delta);
    }
};
