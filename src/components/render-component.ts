import Component from './component'
import TransformComponent from './transform-component'
import Entity from '../entity'
export default class RenderComponent extends Component {
    protected _transform:TransformComponent;
    protected _alpha:number;
    protected _visible:boolean;
    protected _parent:RenderComponent;
    protected _worldAlpha:number;
    protected _worldVisible:boolean;

    set alpha(value:number) {
        this._alpha = value;
    }
    get alpha():number {
        return this._alpha;
    }
    set visible(value:boolean) {
        this._visible = value;
    }
    get visible():boolean {
        return this._visible;
    }
    constructor(entity:Entity) {
        super(entity);
        this._alpha = 1;
        this._visible = true;
        this._worldAlpha = 1;
        this._worldVisible = true;
        this._transform = this._entity.getComponent<TransformComponent>(TransformComponent);
        if (this._transform.hasParent()) {
            this._parent = this._transform.parent.entity.getComponent<RenderComponent>(RenderComponent);
        }
    }
    render(delta:number, ctx:CanvasRenderingContext2D):boolean {
        this._worldVisible = (!this._parent || this._parent._visible) && this._visible;
        this._worldAlpha = (!this._parent ? 1.0 : this._parent._worldAlpha) * this._alpha;
        if (!this._worldVisible || this._worldAlpha == 0) {
            return false;
        }
        let m1 = this._transform.previousTransform;
        let m2 = this._transform.transform;

        let a, b, c, d, tx, ty;
        a = this.lerp(delta, m1.a, m1.a-m2.a, 1);
        b = this.lerp(delta, m1.b, m1.b-m2.b, 1);
        c = this.lerp(delta, m1.c, m1.c-m2.c, 1);
        d = this.lerp(delta, m1.d, m1.d-m2.d, 1);
        tx = this.lerp(delta, m1.tx, m1.tx-m2.tx, 1);
        ty = this.lerp(delta, m1.ty, m1.ty-m2.ty, 1);
        ctx.setTransform(a,b,c,d,tx,ty);
        ctx.globalAlpha = this._worldAlpha;
        return true;
    }   
    lerp(t:number, b:number, c:number, d:number):number {
        return b + (c * (t / d));
    };
}