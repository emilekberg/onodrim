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
    protected _matrix:Matrix;
    protected _oldMatrix:Matrix;
    
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
        this._oldMatrix = new Matrix();
        this._matrix = new Matrix();
        this._transform = this._entity.getComponent(TransformComponent);
        this.requireDepthSort = true;
        Renderer.Renderers.push(this);
    }
    fixedUpdate() {
        if (this._transform.state.dirty) {
            this._oldMatrix.copy(this._matrix);
            this.updateTransform();
            this._transform.state.dirty = false;
        }
    }
    updateTransform() {
        this._matrix
            .identity()
            .rotate(this._transform.state.rotation)
            .scale(this._transform.state.scaleX,this._transform.state.scaleY)
            .translate(this._transform.state.x, this._transform.state.y);
    }
    render(delta:number, ctx:CanvasRenderingContext2D) {
        this.interpolateRenderMatrix(delta);
    }   
    renderWebGL(delta:number, gl:WebGLRenderingContext) {
       
    }
    interpolateRenderMatrix(delta:number) {
        let m1 = this._oldMatrix;
        let m2 = this._matrix;

        for(let i = 0; i < this._matrix.values.length; i++) {
            this._renderedMatrix.values[i] = this.lerp(delta, m1.values[i], m1.values[i]-m2.values[i], 1);
        }
        /*tx.setTransform(
            this._renderedMatrix.a,
            this._renderedMatrix.b,
            this._renderedMatrix.c,
            this._renderedMatrix.d,
            this._renderedMatrix.tx,
            this._renderedMatrix.ty
        );
        ctx.globalAlpha = this.alpha;*/
    }
    isVisible():boolean {
        return this.visible && this.alpha > 0;
    }
    lerp(t:number, b:number, c:number, d:number):number {
        return b + (c * (t / d));
    };
}