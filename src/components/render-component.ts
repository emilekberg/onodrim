import Component from "./component";
import TransformComponent from "./transform-component";
import Entity from "../entity";
import Matrix from "../math/matrix";
import Renderer from "../systems/renderer";
import {lerp} from "../math/interpolation";
export interface RenderComponentTemplate {
    alpha?:number;
    visible?:boolean;
    depth?:number;
}
export interface RenderState {
    matrix:Matrix;
    alpha:number;
}
export default class RenderComponent extends Component {
    public alpha:number;
    public visible:boolean;
    public requireDepthSort:boolean;

    protected _transform:TransformComponent;
    protected _renderedMatrix:Matrix;
    protected _depth:number;
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

    constructor(entity:Entity, template:RenderComponentTemplate = {}) {
        super(entity);
        this._depth  =  template.depth   || 0;
        this.alpha   =  template.alpha   || 1;
        this.visible =	template.visible || true;
        this._renderedMatrix = new Matrix();
        this._oldRenderState = {
            matrix: new Matrix(),
            alpha: 1
        };
        this._renderState = {
            matrix: new Matrix(),
            alpha: 1
        };
        this._transform = this._entity.getComponent(TransformComponent);
        this.requireDepthSort = true;
        Renderer.RENDER_COMPONENTS.push(this);
    }
    public fixedUpdate() {
        this._oldRenderState.matrix.copy(this._renderState.matrix);
        this._oldRenderState.alpha = this._renderState.alpha;
        this.updateTransform();
        this._renderState.alpha = this.alpha;
    }
    public reset() {
        this.updateTransform();
        this._renderState.alpha = this.alpha;
        this._oldRenderState.matrix.copy(this._renderState.matrix);
        this._oldRenderState.alpha = this._renderState.alpha;
    }
    public updateTransform() {
        this._renderState.matrix
            .identity()
            .rotate(this._transform.rotation)
            .scale(this._transform.scaleX,this._transform.scaleY)
            .translate(this._transform.x, this._transform.y);
    }
    public render(delta:number, gl:WebGLRenderingContext) {
        this.interpolateRenderMatrix(delta);
    }
    public interpolateRenderMatrix(delta:number) {
        let m1 = this._oldRenderState.matrix;
        let m2 = this._renderState.matrix;

        for(let i = 0; i < Matrix.count; i++) {
            this._renderedMatrix.values[i] = lerp(delta, m1.values[i], m1.values[i]-m2.values[i], 1);
        }
    }
    public isVisible():boolean {
        return this.visible && this.alpha > 0;
    }
}
