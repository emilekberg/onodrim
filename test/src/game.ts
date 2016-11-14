import * as Onodrim from "onodrim";
import GameObject from "./gameObject";
import Enemy from "./enemy";
import Tile from "./tile";
import Square from "./square";
import ParticleSystem from "./particleSystem";

export default class MyGame extends Onodrim.Game {
    public tile: Tile;
    constructor() {
        super();

        let particles = new GameObject();
        particles.addComponent(new Onodrim.Graphics.ParticleComponent(particles, {
            system: new ParticleSystem()
        }));

        let enemy = new Enemy();
        enemy.transform.x = 400;
        enemy.transform.y = 100;
        this.addEntity(enemy);

        let tile = new Tile();
        tile.transform.x = 400;
        tile.transform.y = 400;
        this.tile = tile;
        this.addEntity(tile);

        let square = new Square();
        square.transform.x = 200;
        square.transform.y = 200;

        square = new Square();
        square.transform.x = 210;
        square.transform.y = 10;

        this.addEntity(square);

        this.addEntity(particles);
        particles.getComponent(Onodrim.Graphics.ParticleComponent).system.start();
    }

    public fixedUpdate() {
        // this.tile.transform.x += Math.sin(Onodrim.Time.now() * 0.5);
        // this.tile.transform.rotation += Onodrim.Time.deltaTime;
    }
}
