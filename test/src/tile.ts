import GameObject from "./gameObject";
import {Components,Resources, Math, Time} from "onodrim";
import Enemy from "./enemy";
export default class Tile extends GameObject {
    protected _sprite:Components.SpriteComponent;
    protected _enemy:Enemy;
    constructor() {
        super();
        this._sprite = new Components.SpriteComponent(this, {
            alpha: 1,
            offset: new Math.Point(0.5, 0.5),
            x: 0,
            y: 0
        });
        this.addComponent(this._sprite);
        this._sprite.setTexture(new Resources.Texture("assets/tile.png"), );
        this.transform.scaleX = 2;
        this.transform.scaleY = 2;

        let enemy = new Enemy();
        this._enemy = enemy;
        this.transform.addChild(enemy.transform);
    }

    public update() {
        this._enemy.transform.rotation -= Time.deltaTime;
    }
}
