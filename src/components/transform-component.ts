// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/display/DisplayObject.js
import Component from './component'
import Point, {PointTemplate} from '../math/point'
import Matrix from '../math/matrix'
import Constants from '../math/constants'
import Entity from '../entity'
export interface TransformComponentTemplate {
    position?:PointTemplate;
    scale?:PointTemplate;
    origo?:PointTemplate;
    rotation?:number;


}
interface TransformState {
    x:number;
    y:number;
    scaleX:number;
    scaleY:number;
    rotation:number;
    origoX:number;
    origoY:number;
    dirty:boolean;
}
export default class TransformComponent extends Component {
    private _firstUpdate:boolean;
    protected _position:Point;
    protected _origo:Point;
    protected _scale:Point;
    protected _rotation:number;
    protected _rotationCache:number;
    protected _cr:number;
    protected _sr:number;
    protected _isDirty:boolean;
    protected _transform:Matrix;
    protected _previousTransform:Matrix;

    protected _children:Array<TransformComponent>;
    protected _parent:TransformComponent;

    state:TransformState;
    previousTransformState:TransformState;

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
    get transform():Matrix {
        return this._transform;
    }
    get previousTransform():Matrix {
        return this._previousTransform;
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
        this._transform = new Matrix();
        this._previousTransform = new Matrix();
        this._firstUpdate = true;
        this._isDirty = true;
        this.state = {
            x: this._position.x,
            y: this._position.y,
            origoX: this._origo.x,
            origoY: this._origo.y,
            scaleX: this._scale.x,
            scaleY: this._scale.y,
            rotation: this._rotation,
            dirty: true
        };
        this.previousTransformState = {
            x: this._position.x,
            y: this._position.y,
            origoX: this._origo.x,
            origoY: this._origo.y,
            scaleX: this._scale.x,
            scaleY: this._scale.y,
            rotation: this._rotation,
            dirty: false
        };
    }

    addChild(child:TransformComponent) {
        if(this.isChild(child)) {
            return;
        }
        this._children.push(child);
        if(child.hasParent()) {
            child._parent.removeChild(child);
        }
        child._parent = this;
    }
    removeChild(child:TransformComponent) {
        let index = this._children.indexOf(child);
        if(index === -1) {
            return;
        }
        this._children.splice(index, 1);
        child._parent = null;
    }
    isChild(transform:TransformComponent):boolean {
        return this._children.indexOf(transform) != -1;
    }
    hasParent():boolean {
        return this._parent != null;
    }

    fixedUpdate() {
        this._previousTransform.copy(this._transform);
        if(this._isDirty) {
            //this.updateTransform();
            this.swapState();
            this.setState();
            for(let i = 0; i < this._children.length; i++) {
                this._children[i].setDirty();
            }
        }
        if(this._firstUpdate) {
            this._previousTransform.copy(this._transform);
            this._firstUpdate = false;
        }
        this._isDirty = false;
    }
    update() {
        this._entity.update();
        for(let i = 0; i < this._children.length; i++) {
            this._children[i].update();
        }
    }

    updateTransform() {
        this._transform
            .identity()
            .rotate(this._rotation)
            .scale(this._scale.x, this._scale.y)
            .translate(this._position.x, this._position.y);
        //this._transform.copy(offset.multiply(rotation).multiply(scale).multiply(translation));
        /*var a, b, c, d, tx, ty;
        var pt = this._parent ? this._parent._transform : Matrix.Identity;
        if(this._rotation % Constants.PI_2) {
            if(this._rotation !== this._rotationCache) {
                this._rotationCache = this._rotation;
                this._sr = Math.sin(this._rotation);
                this._cr = Math.cos(this._rotation)
            }
            a = this._cr * this._scale.x;
            b = this._sr * this._scale.x;
            c = -this._sr * this._scale.y;
            d = this._cr * this._scale.y;
            tx = this._position.x;
            ty = this._position.y;
            
            if(!this._origo.isZero()) {
                tx -= this._origo.x * a + this._origo.y * c;
                ty -= this._origo.x * b * this._origo.y * d; 
            }

            this._transform.a  = a  * pt.a + b  * pt.c;
            this._transform.b  = a  * pt.b + b  * pt.d;
            this._transform.c  = c  * pt.a + d  * pt.c;
            this._transform.d  = c  * pt.b + d  * pt.d;
            this._transform.tx = tx * pt.a + ty * pt.c + pt.tx;
            this._transform.ty = tx * pt.b + ty * pt.d + pt.ty;
        }
        else{
            a  = this._scale.x;
            d  = this._scale.y;

            tx = this._position.x - this._origo.x * a;
            ty = this._position.y - this._origo.y * d;

            this._transform.a  = a  * pt.a;
            this._transform.b  = a  * pt.b;
            this._transform.c  = d  * pt.c;
            this._transform.d  = d  * pt.d;
            this._transform.tx = tx * pt.a + ty * pt.c + pt.tx;
            this._transform.ty = tx * pt.b + ty * pt.d + pt.ty;
        }*/
    }
    private setDirty() {
        this._isDirty = true;
    }

    setState() {
        this.state.x = this._position.x;
        this.state.y = this._position.y;
        this.state.scaleX = this._scale.x;
        this.state.scaleY = this._scale.y;
        this.state.rotation = this._rotation;
        this.state.origoX = this._origo.x;
        this.state.origoY = this._origo.y;
        this.state.dirty = this._isDirty;
    }
    swapState() {
        this.previousTransformState.x = this.state.x;
        this.previousTransformState.y = this.state.y;
        this.previousTransformState.scaleX = this.state.scaleX;
        this.previousTransformState.scaleY = this.state.scaleY;
        this.previousTransformState.rotation = this.state.rotation;
        this.previousTransformState.origoX = this.state.origoX;
        this.previousTransformState.origoY = this.state.origoY;

    }
}