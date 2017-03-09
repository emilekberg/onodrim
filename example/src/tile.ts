import GameObject from './gameObject';
import {Components,Resources, Math, Time} from 'onodrim';
export default class Tile extends GameObject {
    protected _sprite:Components.Sprite;
    constructor() {
        super();
        this._sprite = new Components.Sprite(this, {
            texture: new Resources.Texture({
                url: 'tile'
            })
        });
        this.addComponent(this._sprite);
    }
}
