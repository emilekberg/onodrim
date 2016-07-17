import RenderSystem from './systems/render-system'
import TransformComponent from './components/transform-component'

import Time from './time'
import Entity from './entity'
import Scene from './scene'
export default class Core {
    static Entities:Array<Entity> = [];
    renderer: RenderSystem;
    currentFixedUpdateTime:number;
    nextFixedUpdateTime:number;
    fixedUpdateTime:number;

    constructor() {
        this.fixedUpdateTime = 1/30;
        this.currentFixedUpdateTime = Time.now();
        this.nextFixedUpdateTime = 0;

        this.renderer = new RenderSystem();
        this.tick = this.tick.bind(this);
    }
    start() {
        if (Scene.CurrentScene === null) {
            Scene.AddScene(new Scene());
        }
        requestAnimationFrame(this.tick);
    }
    tick() {
        Time.update();
        if (Time.now() >= this.nextFixedUpdateTime) {
            Time.setFixedUpdateTime(this.fixedUpdateTime)
            this._fixedUpdate();
            this.nextFixedUpdateTime = Time.now() + this.fixedUpdateTime;
        }
        this._update();
        this._render();    
        requestAnimationFrame(this.tick);
    }

    protected _fixedUpdate() {
        Scene.CurrentScene.fixedUpdate();
        for(let i = 0; i < Scene.CurrentScene.entities.length; i++) {
            let transform = Scene.CurrentScene.entities[i].getComponent<TransformComponent>(TransformComponent);
            if (transform) {
                if (!transform.hasParent())
                    transform.fixedUpdate(false);
            }
            else {
                Scene.CurrentScene.entities[i].fixedUpdate();
            }
        }
    }

    protected _update() {
        Scene.CurrentScene.update();
        for(let i = 0; i < Scene.CurrentScene.entities.length; i++) {
            let transform = Scene.CurrentScene.entities[i].getComponent<TransformComponent>(TransformComponent);
            if (transform) {
                transform.update();
            }
            else {
                Scene.CurrentScene.entities[i].update();
            }
        }
    }

    protected _render() {
        let delta = (this.nextFixedUpdateTime-Time.now())/this.fixedUpdateTime;
        this.renderer.render(delta);
    }   


}