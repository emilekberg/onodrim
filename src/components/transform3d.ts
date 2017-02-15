// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/display/DisplayObject.js
import ComponentFactory from './component-factory';
import Vector3, {Vector3Template} from '../math/vector3';
import Entity from '../entity';
import Transform, {TransformTemplate} from './transform';
export interface Transform3DTemplate extends TransformTemplate {
    position?:Vector3Template;
    scale?:Vector3Template;
    origo?:Vector3Template;
    rotation?:number;
}

const enum ParentCache {
    x,
    y,
    z,
    scaleX,
    scaleY,
    scaleZ,
    rotation
};

export default class Transform3D extends Transform {

    protected _position:Vector3;
    protected _scale:Vector3;
    protected _up:Vector3;
    protected _left:Vector3;
    protected _isDirty:boolean;

    private _parentCache:number[];

    get parent():Transform3D {
        return this._parent as Transform3D;
    }
    get entity():Entity {
        return this._entity;
    }
    get position():Vector3 {
        return this._position;
    }
    set position(value:Vector3) {
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
    get z():number {
        return this._position.y;
    }
    set z(value:number) {
        this._position.z = value;
        this.setDirty();
    }
    get scale():Vector3 {
        return this._scale;
    }
    set scale(value:Vector3) {
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
    get scaleZ():number {
        return this._scale.z;
    }
    set scaleZ(value:number) {
        this._scale.z = value;
        this.setDirty();
    }
    set rotation(value:number) {
        // this._rotation = value;
        this.setDirty();
    }
    get rotation():number {
        return 0;// this._rotation;
    }

    get worldX():number {
        return this._parentCache[ParentCache.x] + this._position.x;
    }
    get worldY():number {
        return this._parentCache[ParentCache.y] + this._position.y;
    }
    get worldZ():number {
        return this._parentCache[ParentCache.z] + this._position.z;
    }
    get worldScaleX():number {
        return this._parentCache[ParentCache.scaleX] + this._scale.x;
    }
    get worldScaleY():number {
        return this._parentCache[ParentCache.scaleY] + this._scale.y;
    }
    get worldScaleZ():number {
        return this._parentCache[ParentCache.scaleZ] + this._scale.z;
    }
    get worldRotation():number {
        return this._parentCache[ParentCache.rotation] + 0;// this._rotation;
    }

    get isDirty():boolean {
        return this._isDirty;
    }
    constructor(entity:Entity, template:Transform3DTemplate = {}) {
        super(entity, template);
        this._position = template.position ? Vector3.fromTemplate(template.position) : new Vector3();
        this._scale = template.scale ? Vector3.fromTemplate(template.scale) : new Vector3(1,1,1);
        this._up = new Vector3(0,1,0);
        this._left = new Vector3(1,0,0);
        this._parent = null;
        this._isDirty = true;

        this._parentCache = new Array<number>(5);
        for(let i = 0; i < 5; ++i) {
            this._parentCache[i] = 0;
        }
    }

    public fixedUpdate() {
        if (this.parent && this.parent.isDirty) {
            this._isDirty = true;
            this._parentCache[ParentCache.x] = this.parent.worldX;
            this._parentCache[ParentCache.y] = this.parent.worldY;
            this._parentCache[ParentCache.z] = this.parent.worldZ;
            this._parentCache[ParentCache.scaleX] = this.parent.worldScaleX;
            this._parentCache[ParentCache.scaleY] = this.parent.worldScaleY;
            this._parentCache[ParentCache.scaleZ] = this.parent.worldScaleZ;
            this._parentCache[ParentCache.rotation] = this.parent.worldRotation;
        }
        const l = this._children.length;
        for(let i = 0; i < l; ++i) {
            const child = this._children[i];
            const components = child.getEntity().getAllFixedUpdateComponents();
            for(let j = 0; j < components.length; ++j) {
                components[j].fixedUpdate();
            }
        }
        this._isDirty = false;
    }

    public update() {
        if (this.parent && this.parent.isDirty) {
            this._isDirty = true;
            this._parentCache[ParentCache.x] = this.parent.worldX;
            this._parentCache[ParentCache.y] = this.parent.worldY;
            this._parentCache[ParentCache.z] = this.parent.worldZ;
            this._parentCache[ParentCache.scaleX] = this.parent.worldScaleX;
            this._parentCache[ParentCache.scaleY] = this.parent.worldScaleY;
            this._parentCache[ParentCache.scaleZ] = this.parent.worldScaleZ;
            this._parentCache[ParentCache.rotation] = this.parent.worldRotation;
        }
        const l = this._children.length;
        for(let i = 0; i < l; ++i) {
            const child = this._children[i];
            const components = child.getEntity().getAllUpdateComponents();
            for(let j = 0; j < components.length; j++) {
                components[j].update();
            }
        }
        this._isDirty = false;
    }

    private setDirty() {
        this._isDirty = true;
    }
}
ComponentFactory.register(Transform3D);
