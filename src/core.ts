import RenderSystem from './systems/canvas/render-system'
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
        if(Scene.CurrentScene === null) {
            Scene.AddScene(new Scene());
        }
        requestAnimationFrame(this.tick);
    }
    tick() {
        while(Time.now() >= this.nextFixedUpdateTime) {
            Time.setFixedUpdateTime(this.fixedUpdateTime)
            this._fixedUpdate();
            this.nextFixedUpdateTime = Time.now() + this.fixedUpdateTime;
        }
        Time.update();
        this._update();
        this._render();    
        requestAnimationFrame(this.tick);
    }

    protected _fixedUpdate() {
        Scene.CurrentScene.fixedUpdate();
        for(let i = 0; i < Scene.CurrentScene.entities.length; i++) {
            Scene.CurrentScene.entities[i].fixedUpdate();
            let components = Scene.CurrentScene.entities[i].getAllComponents();
            for(let i = 0; i < components.length; i++) {
                components[i].fixedUpdate();
            }
        }
    }

    protected _update() {
        Scene.CurrentScene.update();
        for(let i = 0; i < Scene.CurrentScene.entities.length; i++) {
            Scene.CurrentScene.entities[i].update();
            let components = Scene.CurrentScene.entities[i].getAllComponents();
            for(let i = 0; i < components.length; i++) {
                components[i].update();
            }
        }
    }

    protected _render() {
        let delta = (this.nextFixedUpdateTime-Time.now())/this.fixedUpdateTime;
        this.renderer.render(delta);
    }   


}