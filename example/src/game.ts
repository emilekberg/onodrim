import * as Onodrim from 'onodrim';
import GameObject from './gameObject';
import Square from './square';
import ParticleSystem from './particleSystem';
import Rotating from './rotating';
import PlayerController from './playerController';

export default class MyGame extends Onodrim.Game {
	private _tileTransform: Onodrim.Components.Transform2D;
	private _enemyTransform: Onodrim.Components.Transform2D;
	private _audio: Onodrim.Resources.Audio.Audio;
	constructor() {
		super();

		/*const particles = new GameObject();
		particles.addComponent(new Onodrim.Graphics.ParticleComponent(particles, {
			system: new ParticleSystem()
		}));*/
		const enemy = Onodrim.EntityFactory.create({
			name: 'enemy',
			components: [
				{
					type: 'onodrim.transform2d',
					position: {
						x: 200,
						y: 300
					}
				},
				{
					type: 'onodrim.animation',
					texture: {
						url: 'slime'
					},
					autoStart: true,
					fps: 24,
					framesFromRect: {x: 0, y: 0, w: 16, h: 16}
				}
			]
		});
		this.addEntity(enemy);
		const enemyTransform = enemy.getComponent(Onodrim.Components.Transform2D);

		const camera = Onodrim.EntityFactory.create({
			name: 'camera',
			components: [
				{ type: 'onodrim.transform2d' },
				{ type: 'onodrim.camera2d' }
			]
		});
		camera.addComponent(new PlayerController(camera));
		enemyTransform.addChild(camera.getComponent(Onodrim.Components.Transform2D));

		const tile = new Onodrim.Entity();
		tile.addComponent(new Onodrim.Components.Transform2D(tile, {
			position: {
				x: 400,
				y: 400
			}
		}));
		tile.addComponent(new Onodrim.Components.Sprite(tile, {
			texture: new Onodrim.Resources.Texture({url: 'tile'})
		}));
		tile.addComponent(new Rotating(tile));
		this._tileTransform = tile.getComponent(Onodrim.Components.Transform2D);
		this.addEntity(tile);

		const tile2 = new Onodrim.Entity();
		tile2.addComponent(new Onodrim.Components.Transform2D(tile2, {
			position: {
				x: 0,
				y: 40
			}
		}));
		tile2.addComponent(new Onodrim.Components.Sprite(tile2, {
			texture: new Onodrim.Resources.Texture({url: 'tile'})
		}));
		const tileTransform2 = tile2.getComponent(Onodrim.Components.Transform2D);
		this._tileTransform.addChild(tileTransform2);
		this.addEntity(tile2);

		const square = new Square();
		square.transform.x = 200;
		square.transform.y = 200;
		this.addEntity(square);

		// this.addEntity(particles);
		// particles.getComponent(Onodrim.Graphics.ParticleComponent).system.start();

		this._audio = new Onodrim.Resources.Audio.Audio({
			name: 'laut'
		});
		// this._audio.play();
	}
}
