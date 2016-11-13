import GameObject from "./gameObject";
import {Components,Math,Resources} from "onodrim";
export default class Enemy extends GameObject {
    protected _sprite:Components.AnimationComponent;
    constructor() {
        super();
        this._sprite = Components.AnimationComponent.CreateFromRect(this, {
            texture: new Resources.Texture("assets/SlimeA.png"),
            autoStart: true,
            fps: 24
        }, new Math.Rect(0, 0, 16, 16));
        this.transform.scaleX = 4;
        this.transform.scaleY = 4;
        this.addComponent(this._sprite);
        this._sprite.offset = new Math.Point(0.5, 0.5);
    }
}
