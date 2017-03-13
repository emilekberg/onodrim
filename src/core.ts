import Entity from './entity';
import WebGLSystem from './system/webgl/webgl-system';
import Time from './time';
import SystemManager from './system/system-manager';
import Game from './game';
import Input from './input';
import CameraSystem from './system/camera/camera-system';
export interface CoreConfig {
    width?:number;
    height?:number;
    canvas?:HTMLCanvasElement;
}
export default class Core {
    public static ENTITIES: Entity[] = [];
    public renderSystem:WebGLSystem;
    public currentFixedUpdateTime:number;
    public nextFixedUpdateTime:number;
    public fixedUpdateTime:number;
    public game:Game;

    protected _gameLoop:()=>void;
    constructor(config?:CoreConfig) {
        this.fixedUpdateTime = 1/30;
        this.currentFixedUpdateTime = Time.now();
        this.nextFixedUpdateTime = Time.now() + this.fixedUpdateTime;

        SystemManager.addSystem(new WebGLSystem(config));
        SystemManager.addSystem(new CameraSystem());
        const webglSystem = SystemManager.getSystem(WebGLSystem);
        if (!webglSystem) {
            console.error('WebGLSystem not created for some reason');
        }
        else {
            this.renderSystem = webglSystem;
        }

        this._gameLoop = () => {
            this.gameLoop();
        };
    }

    public start(game:Game = new Game()) {
        this.game = game;
        this.game.start();
        this.currentFixedUpdateTime = Time.now();
        this.nextFixedUpdateTime = Time.now() + this.fixedUpdateTime;
        requestAnimationFrame(this._gameLoop);
    }

    public gameLoop() {
        Time.setFixedUpdateTime(this.fixedUpdateTime);
        while(Time.now() >= this.nextFixedUpdateTime) {
            this._fixedUpdate();
            this.currentFixedUpdateTime = this.nextFixedUpdateTime;
            this.nextFixedUpdateTime += this.fixedUpdateTime;
        }
        Time.update();
        this._update();
        this._render();
        Input.fixedUpdate();
        requestAnimationFrame(this._gameLoop);
    }

    protected _fixedUpdate() {
        this.game.fixedUpdate();
        for(let i = 0; i < this.game.entities.length; ++i) {
            const entity = this.game.entities[i];
            entity.fixedUpdate();
            const components = entity.getAllFixedUpdateComponents();
            const numComponents = components.length;
            for(let j = 0; j < numComponents; ++j) {
                components[j].fixedUpdate();
            }
        }
    }

    protected _update() {
        this.game.update();
        for(let i = 0; i < this.game.entities.length; ++i) {
            const entity = this.game.entities[i];
            entity.update();
            const components = entity.getAllUpdateComponents();
            const numComponents = components.length;
            for(let j = 0; j < numComponents; ++j) {
                components[j].update();
            }
        }
    }

    protected _render() {
        const delta = (Time.now()-this.currentFixedUpdateTime)/this.fixedUpdateTime;
        this.renderSystem.render(delta);
    }
};
