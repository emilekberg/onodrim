import Component from './component';
import Transform2D from './transform2d';
import Entity from '../entity';
import Matrix3, {Value} from '../math/matrix3';
import WebGLSystem from '../system/webgl/webgl-system';
import SpriteBatch from '../system/webgl/sprite-batch';
import SystemManager from '../system/system-manager';
import {lerp} from '../math/interpolation';
import Color from '../graphics/color';
export interface RenderComponentTemplate {
    alpha?:number;
    visible?:boolean;
    depth?:number;
}

export interface RenderState {
    wasDirty:boolean;
    matrix:Matrix3;
    alpha:number;
}

export default class RenderComponent extends Component {
    public alpha:number;
    public visible:boolean;
    public requireDepthSort:boolean;

    protected _transform:Transform2D;
    protected _renderedMatrix:Matrix3;
    protected _depth:number;
    protected _oldRenderState:RenderState;
    protected _renderState:RenderState;
    protected _color:Color;

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
        this._depth  =  template.depth || 0;
        this.alpha   =  template.alpha || 1;
        this.visible =	template.visible || true;
        this._renderedMatrix = new Matrix3();
        this._oldRenderState = {
            matrix: new Matrix3(),
            alpha: 1,
            wasDirty: true
        };
        this._renderState = {
            matrix: new Matrix3(),
            alpha: 1,
            wasDirty: true
        };
        this._color = new Color(1, 1, 1, 1);

        const transform = this._entity.getComponent(Transform2D);
        if (!transform) {
            console.error('RenderComponent cannot find component Transform2D.');
        }
        else {
            this._transform = transform;
        }

        this.requireDepthSort = true;
        const webglSystem = SystemManager.getSystem(WebGLSystem);
        if (webglSystem) {
            webglSystem.addComponentInstance(this);
        }
    }

    public destroy():void {
        const webglSystem = SystemManager.getSystem(WebGLSystem);
        if (webglSystem) {
            webglSystem.removeComponentInstance(this);
        }
    }

    public fixedUpdate() {
        this._oldRenderState.wasDirty = this._renderState.wasDirty;
        this._oldRenderState.matrix.copy(this._renderState.matrix);
        this._oldRenderState.alpha = this._renderState.alpha;

        this.updateTransform();
        this._renderState.wasDirty = this._transform.wasDirty;
        this._renderState.alpha = this.alpha;
        this._color.a = this.alpha;
    }

    public reset() {
        this.updateTransform();
        this._renderState.alpha = this.alpha;
        this._oldRenderState.matrix.copy(this._renderState.matrix);
        this._oldRenderState.alpha = this._renderState.alpha;
    }

    public updateTransform() {
        this._renderState.wasDirty = true;
        this._renderState.matrix
            .identity()
            .rotate(this._transform.worldRotation)
            .scale(this._transform.worldScaleX,this._transform.worldScaleY)
            .translate(this._transform.worldX, this._transform.worldY);
    }

    public render(delta:number, gl:WebGLRenderingContext, batch:SpriteBatch) {
        this.interpolateRenderMatrix(delta);
    }

    public interpolateRenderMatrix(delta:number) {
        if(!this._renderState.wasDirty && !this._oldRenderState.wasDirty) {
            return;
        }
        const m1 = this._oldRenderState.matrix.values;
        const m2 = this._renderState.matrix.values;

        this._renderedMatrix.values[Value.a] = lerp(delta, m1[Value.a], m1[Value.a]-m2[Value.a], 1);
        this._renderedMatrix.values[Value.b] = lerp(delta, m1[Value.b], m1[Value.b]-m2[Value.b], 1);
        this._renderedMatrix.values[Value.c] = lerp(delta, m1[Value.c], m1[Value.c]-m2[Value.c], 1);
        this._renderedMatrix.values[Value.d] = lerp(delta, m1[Value.d], m1[Value.d]-m2[Value.d], 1);
        this._renderedMatrix.values[Value.tx] = lerp(delta, m1[Value.tx], m1[Value.tx]-m2[Value.tx], 1);
        this._renderedMatrix.values[Value.ty] = lerp(delta, m1[Value.ty], m1[Value.ty]-m2[Value.ty], 1);

    }

    public isVisible():boolean {
        return this.visible && this.alpha > 0;
    }
}
