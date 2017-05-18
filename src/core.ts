import Entity from './entity';
import WebGLSystem from './system/webgl/webgl-system';
import Time from './time';
import SystemManager from './system/system-manager';
import Game from './game';
import Input from './input';
import CameraSystem from './system/camera/camera-system';
import UpdateSystem from './system/update/update-system';
import FixedUpdateSystem from './system/update/fixed-update-system';
import CollisionSystem from './system/collision/collision-system';

export interface CoreConfig {
	width?:number;
	height?:number;
	canvas?:HTMLCanvasElement;
}
export default class Core {
	public static ENTITIES: Entity[] = [];
	public renderSystem:WebGLSystem;
	public fixedUpdateSystem: FixedUpdateSystem;
	public game:Game;

	constructor(config?:CoreConfig) {
		SystemManager.addSystem(new UpdateSystem());
		SystemManager.addSystem(new CollisionSystem());
		this.fixedUpdateSystem = new FixedUpdateSystem();
		SystemManager.addSystem(this.fixedUpdateSystem);
		SystemManager.addSystem(new WebGLSystem(config));
		SystemManager.addSystem(new CameraSystem());
		const webglSystem = SystemManager.getSystem(WebGLSystem);
		if (!webglSystem) {
			console.error('WebGLSystem not created for some reason');
		}
		else {
			this.renderSystem = webglSystem;
			Input.registerEvents(webglSystem.canvas);
		}
	}

	public start(game:Game = new Game()) {
		this.game = game;
		this.game.start();
		requestAnimationFrame(this.tick);
	}

	public tick = () => {
		SystemManager.tick();
		this._render();
		Input.fixedUpdate();
		requestAnimationFrame(this.tick);
	}

	/**
	 * TODO: remove this render from here. it would be best if rendersystem could call it by itself
	 * through the SystemManager, and make sure it's always called after update systems.
	 */
	protected _render() {
		const delta = (Time.now()-this.fixedUpdateSystem.currentUpdateTime)/this.fixedUpdateSystem.updateRate;
		this.renderSystem.render(delta);
	}
}
