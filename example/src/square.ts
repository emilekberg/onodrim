import GameObject from './gameObject';
import {Components,Resources, Math} from 'onodrim';
export default class Square extends GameObject {
    protected _sprite:Components.Sprite;
    constructor() {
        super();
        this._sprite = new Components.Sprite(this, {
            alpha: 1,
            offset: new Math.Point(0, 0),
            x: 0,
            y: 0,
            depth: -1,
            texture: new Resources.Texture('assets/square.png')
        });
        this.addComponent(this._sprite);
        this.transform.scaleX = 1;
        this.transform.scaleY = 1;
    }
}
