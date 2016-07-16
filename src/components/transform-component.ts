import Component from './component'
import Point from '../math/point'
import Matrix from '../math/matrix'
import Constants from '../math/constants'
import Entity from '../entity'
export default class TransformComponent extends Component {
    static get IDENTITY() {
        return [1,0,0,1,0,0];
    }

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

    get position():Point {
        return this._position;
    }
    set position(value:Point) {
        this._position = value;
        this._isDirty = true;
    }
    get x():number {
        return this._position.x;
    }
    set x(value:number) {
        this._position.x = value;
        this._isDirty = true;
    }
    get y():number {
        return this._position.y;
    }
    set y(value:number) {
        this._position.y = value;
        this._isDirty = true;
    }
    get scale():Point {
        return this._scale;
    }
    set scale(value:Point) {
        this._scale = value;
        this._isDirty = true;
    }
    get scaleX():number {
        return this._scale.x;
    }
    set scaleX(value:number) {
        this._scale.x = value;
        this._isDirty = true;
    }
    get scaleY():number {
        return this._scale.y;
    }
    set scaleY(value:number) {
        this._scale.y = value;
        this._isDirty = true;
    }
    get origo():Point {
        return this._origo;
    }
    set origo(value:Point) {
        this._origo = value;
        this._isDirty = true;
    }
    set rotation(value:number) {
        this._rotation = value;
        this._isDirty = true;
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
    constructor(entity:Entity) {
        super(entity);
        this._children = new Array<TransformComponent>();
        this._position = new Point(0,0);
        this._origo = new Point(0,0);
        this._scale = new Point(1, 1);
        this._parent = null;
        this._rotation = 0;
        this._rotationCache = 0;
        this._cr = 1;
        this._sr = 1;
        this._transform = new Matrix();
        this._previousTransform = new Matrix();
    }

    addChild(child:TransformComponent) {
        if (this.isChild(child)) {
            return;
        }
        this._children.push(child);
        if (child.hasParent()) {
            child._parent.removeChild(child);
        }
        child._parent = this;
    }
    removeChild(child:TransformComponent) {
        let index = this._children.indexOf(child);
        if (index === -1) {
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

    fixedUpdate(dirty) {
        this._isDirty = this._isDirty || dirty;
        this._entity.fixedUpdate();
        this._previousTransform.copyFrom(this._transform);
        if (this._isDirty) {
            this.updateTransform();
        }
        
        for(let i = 0; i < this._children.length; i++) {
            this._children[i].fixedUpdate(this._isDirty);
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
        var a, b, c, d, tx, ty;
        var pt = this._parent ? this._parent._transform : Matrix.Identity;
        //var wt = this._transform;

        if (this._rotation % Constants.PI_2) {
            if (this._rotation !== this._rotationCache) {
                this._rotationCache = this._rotation;
                this._sr = Math.sin(this._rotation);
                this._cr = Math.cos(this._rotation)
            }

            a = this._cr * this._scale.x;
            b = this._sr * this._scale.x;
            c = this._sr * this._scale.y;
            d = this._cr * this._scale.y;
            tx = this._position.x;
            ty = this._position.y;
            
            if (this._origo.isZero()) {
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
        }
        

        /*this._nextTransform.set(this._scale.x, this._rotation, this._rotation, this._scale.y, this._position.x, this._position.y);
        if (this._parent) {
            this._nextTransform.merge(this._parent.nextTransform)
        }*/
    }
}