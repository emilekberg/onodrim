import Component from './component'
import TransformComponent from './transform-component'
import Entity from '../entity'
import Matrix from '../math/matrix'
import Renderer from '../systems/renderer'
export interface RenderComponentTemplate {
    alpha?:number;
    visible?:boolean;
    depth?:number;
}
export default class RenderComponent extends Component {
    protected _transform:TransformComponent;
    alpha:number;
    visible:boolean;
    protected _renderedMatrix:Matrix;
    protected _depth:number;
    
    get depth():number {
        return this._depth;
    }
    set depth(value:number) {
        if(this._depth !== value) {
            this.requireDepthSort = true;
        }
        this._depth = value;
    }
    public requireDepthSort;
    constructor(entity:Entity, template:RenderComponentTemplate = {}) {
        super(entity);
        this._depth  =  template.depth   || 0;
        this.alpha   =  template.alpha   || 1;
        this.visible =	template.visible || true;
        this._renderedMatrix = new Matrix();
        
        this._transform = this._entity.getComponent(TransformComponent);
        this.requireDepthSort = true;
        Renderer.Renderers.push(this);
    }
    render(delta:number, ctx:CanvasRenderingContext2D) {
        this.interpolateRenderMatrix(delta, ctx);
    }   
    interpolateRenderMatrix(delta:number, ctx:CanvasRenderingContext2D) {
        let m1 = this._transform.previousTransform;
        let m2 = this._transform.transform;

        this._renderedMatrix.a = this.lerp(delta, m1.a, m1.a-m2.a, 1);
        this._renderedMatrix.b = this.lerp(delta, m1.b, m1.b-m2.b, 1);
        this._renderedMatrix.c = this.lerp(delta, m1.c, m1.c-m2.c, 1);
        this._renderedMatrix.d = this.lerp(delta, m1.d, m1.d-m2.d, 1);
        this._renderedMatrix.tx = this.lerp(delta, m1.tx, m1.tx-m2.tx, 1);
        this._renderedMatrix.ty = this.lerp(delta, m1.ty, m1.ty-m2.ty, 1);
        ctx.setTransform(
            this._renderedMatrix.a,
            this._renderedMatrix.b,
            this._renderedMatrix.c,
            this._renderedMatrix.d,
            this._renderedMatrix.tx,
            this._renderedMatrix.ty
        );
        ctx.globalAlpha = this.alpha;
    }
    isVisible():boolean {
        return this.visible && this.alpha > 0;
    }
    lerp(t:number, b:number, c:number, d:number):number {
        return b + (c * (t / d));
    };
}