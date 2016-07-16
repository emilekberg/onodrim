import RenderSystem from './systems/render-system'
import TransformComponent from './components/transform-component'

import Time from './time'
import Entity from './entity'
export default class Core {
    static Entities:Array<Entity> = [];
    renderer: RenderSystem;
    currentFixedUpdateTime:number;
    nextFixedUpdateTime:number;
    fixedUpdateTime:number;

    constructor() {
        this.fixedUpdateTime = 1/30;
        this.currentFixedUpdateTime = Time.now();
        this.nextFixedUpdateTime = this.currentFixedUpdateTime+this.fixedUpdateTime;

        this.renderer = new RenderSystem();
        this.tick = this.tick.bind(this);
    }
    start() {
        requestAnimationFrame(this.tick);
    }
    tick() {
        Time.update();
        if (Time.now() >= this.nextFixedUpdateTime) {
            Time.setFixedUpdateTime(this.fixedUpdateTime)
            this._fixedUpdate();
            this.nextFixedUpdateTime += this.fixedUpdateTime;
        }
        this._update();
        this._render();    
        requestAnimationFrame(this.tick);
    }

    protected _fixedUpdate() {
        for(let i = 0; i < Core.Entities.length; i++) {
            let transform = Core.Entities[i].getComponent<TransformComponent>(TransformComponent);
            if (transform) {
                if (!transform.hasParent())
                    transform.fixedUpdate(false);
            }
            else {
                Core.Entities[i].fixedUpdate();
            }
        }
    }

    protected _update() {
        for(let i = 0; i < Core.Entities.length; i++) {
            let transform = Core.Entities[i].getComponent<TransformComponent>(TransformComponent);
            if (transform) {
                transform.update();
            }
            else {
                Core.Entities[i].update();
            }
        }
    }

    protected _render() {
        let delta = (this.nextFixedUpdateTime-Time.now())/this.fixedUpdateTime;
        this.renderer.render(delta);
    }   
}