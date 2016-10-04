// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/display/DisplayObject.js
import Component from "./component";
import Point, {PointTemplate} from "../math/point";
import Entity from "../entity";
export interface TransformComponentTemplate {
    position?:PointTemplate;
    scale?:PointTemplate;
    origo?:PointTemplate;
    rotation?:number;
}

export default class TransformComponent extends Component {
    protected _position:Point;
    protected _origo:Point;
    protected _scale:Point;
    protected _rotation:number;
    protected _rotationCache:number;
    protected _cr:number;
    protected _sr:number;
    protected _isDirty:boolean;

    protected _children:Array<TransformComponent>;
    protected _parent:TransformComponent;
    private _firstUpdate:boolean;

    get parent():TransformComponent {
        return this._parent;
    }
    get entity():Entity {
        return this._entity;
    }
    get position():Point {
        return this._position;
    }
    set position(value:Point) {
        this._position = value;
        this.setDirty();
    }
    get x():number {
        return this._position.x;
    }
    set x(value:number) {
        this._position.x = value;
        this.setDirty();
    }
    get y():number {
        return this._position.y;
    }
    set y(value:number) {
        this._position.y = value;
        this.setDirty();
    }
    get scale():Point {
        return this._scale;
    }
    set scale(value:Point) {
        this._scale = value;
        this.setDirty();
    }
    get scaleX():number {
        return this._scale.x;
    }
    set scaleX(value:number) {
        this._scale.x = value;
        this.setDirty();
    }
    get scaleY():number {
        return this._scale.y;
    }
    set scaleY(value:number) {
        this._scale.y = value;
        this.setDirty();
    }
    get origo():Point {
        return this._origo;
    }
    set origo(value:Point) {
        this._origo = value;
        this.setDirty();
    }
    set rotation(value:number) {
        this._rotation = value;
        this.setDirty();
    }
    get rotation():number {
        return this._rotation;
    }
    constructor(entity:Entity, template:TransformComponentTemplate = {}) {
        super(entity);
        this._children = new Array<TransformComponent>();
        this._position = template.position ? new Point(template.position.x,template.position.y) : new Point();
        this._origo = template.origo ? new Point(template.origo.x,template.origo.y) : new Point();
        this._scale = template.origo ? new Point(template.origo.x,template.origo.y) : new Point(1,1);
        this._rotation = template.rotation || 0;
        this._rotationCache = 0;
        this._parent = null;
        this._cr = 1;
        this._sr = 0;
        this._firstUpdate = true;
        this._isDirty = true;
    }

    public addChild(child:TransformComponent) {
        if(this.isChild(child)) {
            return;
        }
        this._children.push(child);
        if(child.hasParent()) {
            child._parent.removeChild(child);
        }
        child._parent = this;
    }
    public removeChild(child:TransformComponent) {
        let index = this._children.indexOf(child);
        if(index === -1) {
            return;
        }
        this._children.splice(index, 1);
        child._parent = null;
    }
    public isChild(transform:TransformComponent):boolean {
        return this._children.indexOf(transform) !== -1;
    }
    public hasParent():boolean {
        return this._parent !== null;
    }

    public fixedUpdate() {
        // TODO: implement
    }
    public update() {
        // TODO: implement
    }

    private setDirty() {
        this._isDirty = true;
    }
}
