import GameObject from "./gameObject";
import {Components,Resources, Math} from "onodrim";
export default class Square extends GameObject {
    protected _sprite:Components.SpriteComponent;
    constructor() {
        super();
        this._sprite = new Components.SpriteComponent(this, {
            alpha: 1,
            offset: new Math.Point(0.5, 0.5),
            x: 0,
            y: 0,
            depth: -1,
            texture: new Resources.Texture("assets/square.png")
        });
        this.addComponent(this._sprite);
        this.transform.scaleX = 0.25;
        this.transform.scaleY = 0.25;
    }
}
