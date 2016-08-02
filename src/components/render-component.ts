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
interface RenderState {
    matrix:Matrix;
    alpha:number
}
export default class RenderComponent extends Component {
    protected _transform:TransformComponent;
    alpha:number;
    visible:boolean;
    protected _renderedMatrix:Matrix;
    protected _depth:number;
    //protected _matrix:Matrix;
    //protected _oldMatrix:Matrix;
    protected _oldRenderState:RenderState;
    protected _renderState:RenderState;

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
        this._oldRenderState = {
            matrix: new Matrix(),
            alpha: 1
        }
        this._renderState = {
            matrix: new Matrix(),
            alpha: 1
        }
        this._transform = this._entity.getComponent(TransformComponent);
        this.requireDepthSort = true;
        Renderer.Renderers.push(this);
    }
    fixedUpdate() {
        this._oldRenderState.matrix.copy(this._renderState.matrix);
        this._oldRenderState.alpha = this._renderState.alpha;
        this.updateTransform();
        this._renderState.alpha = this.alpha;
    }
    reset() {
        this.updateTransform();
        this._renderState.alpha = this.alpha;
        this._oldRenderState.matrix.copy(this._renderState.matrix);
        this._oldRenderState.alpha = this._renderState.alpha;
    }
    updateTransform() {
        this._renderState.matrix
            .identity()
            .rotate(this._transform.rotation)
            .scale(this._transform.scaleX,this._transform.scaleY)
            .translate(this._transform.x, this._transform.y);
    }
    render(delta:number, ctx:CanvasRenderingContext2D) {
        this.interpolateRenderMatrix(delta);
    }   
    renderWebGL(delta:number, gl:WebGLRenderingContext) {
       
    }
    interpolateRenderMatrix(delta:number) {
        let m1 = this._oldRenderState.matrix;
        let m2 = this._renderState.matrix;

        for(let i = 0; i < Matrix.count; i++) {
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