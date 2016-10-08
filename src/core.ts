import Entity from "./entity";
import RenderSystem from "./system/render-system";
import Time from "./time";
import SystemManager from "./system/system-manager";
import Game from "./game";
export default class Core {
    public static ENTITIES: Array<Entity> = [];
    public renderSystem: RenderSystem;
    public currentFixedUpdateTime: number;
    public nextFixedUpdateTime: number;
    public fixedUpdateTime: number;
    public game:Game;
    protected _gameLoop:()=>void;
    constructor() {
        this.fixedUpdateTime = 1/30;
        this.currentFixedUpdateTime = Time.now();
        this.nextFixedUpdateTime = 0;

        SystemManager.addSystem(new RenderSystem());
        this.renderSystem = SystemManager.getSystem(RenderSystem);
        this._gameLoop = () => {
            this.gameLoop();
        };
    }

    public start(game:Game = new Game()) {
        this.game = game;
        this.game.start();
        requestAnimationFrame(this._gameLoop);
    }

    public gameLoop() {
        while(Time.now() >= this.nextFixedUpdateTime) {
            Time.setFixedUpdateTime(this.fixedUpdateTime);
            this._fixedUpdate();
            this.nextFixedUpdateTime += this.fixedUpdateTime;
        }
        Time.update();
        this._update();
        this._render();
        requestAnimationFrame(this._gameLoop);
    }

    protected _fixedUpdate() {
        this.game.fixedUpdate();
        for(let i = 0; i < this.game.entities.length; i++) {
            let entity = this.game.entities[i];
            entity.fixedUpdate();
            let components = entity.getAllComponents();
            for(let j = 0; j < components.length; j++) {
                components[j].fixedUpdate();
            }
        }
    }

    protected _update() {
        this.game.update();
        for(let i = 0; i < this.game.entities.length; i++) {
            let entity = this.game.entities[i];
            entity.update();
            let components = entity.getAllComponents();
            for(let j = 0; j < components.length; j++) {
                components[j].update();
            }
        }
    }

    protected _render() {
        let delta = (this.nextFixedUpdateTime-Time.now())/this.fixedUpdateTime;
        this.renderSystem.render(delta);
    }
};
