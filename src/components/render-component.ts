import Component from "./component";
import Transform2DComponent from "./transform2d-component";
import Entity from "../entity";
import Matrix from "../math/matrix";
import RenderSystem from "../system/render-system";
import SystemManager from "../system/system-manager";
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

    protected _transform:Transform2DComponent;
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
        this._transform = this._entity.getComponent(Transform2DComponent);
        this.requireDepthSort = true;
        SystemManager.getSystem(RenderSystem).addComponentInstance(this);
    }
    public destroy():void {
        SystemManager.getSystem(RenderSystem).removeComponentInstance(this);
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
            .rotate(this._transform.worldRotation)
            .scale(this._transform.worldScaleX,this._transform.worldScaleY)
            .translate(this._transform.worldX, this._transform.worldY);
    }
    public render(delta:number, gl:WebGLRenderingContext) {
        this.interpolateRenderMatrix(delta);
    }
    public interpolateRenderMatrix(delta:number) {
        let m1 = this._oldRenderState.matrix;
        let m2 = this._renderState.matrix;

        let equal = true;
        for(let i = 0; i < Matrix.count; i++) {
            equal = m1.values[i] === m2.values[i];
            if (equal === false) {
                break;
            }
            this._renderedMatrix.values[i] = m1.values[i];
        }
        if (equal) {
            return;
        }
        for(let i = 0; i < Matrix.count; i++) {
            this._renderedMatrix.values[i] = lerp(delta, m1.values[i], m1.values[i]-m2.values[i], 1);
        }
    }

    public isVisible():boolean {
        return this.visible && this.alpha > 0;
    }
}
