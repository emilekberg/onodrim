import GameObject from './gameObject';
import {Components,Resources, Math, Time} from 'onodrim';
import Enemy from './enemy';
export default class Tile extends GameObject {
    protected _sprite:Components.Sprite;
    protected _enemy:Enemy;
    constructor() {
        super();
        this._sprite = new Components.Sprite(this, {
            texture: new Resources.Texture('assets/colors.png')
        });
        this.addComponent(this._sprite);
        this.transform.scaleX = 4;
        this.transform.scaleY = 4;

        /*let enemy = new Enemy();
        this._enemy = enemy;
        this.transform.addChild(enemy.transform);
        */
    }

    public update() {
        // this._enemy.transform.rotation -= Time.deltaTime;
    }
}
