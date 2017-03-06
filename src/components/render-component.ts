import ComponentFactory from './component-factory';
import Component, {Template} from './component';
import Transform2D from './transform2d';
import Entity from '../entity';
import Matrix3, {Value} from '../math/matrix3';
import WebGLSystem from '../system/webgl/webgl-system';
import SpriteBatch from '../system/webgl/sprite-batch';
import SystemManager from '../system/system-manager';
import {interpolate, extrapolate} from '../math/interpolation';
import Color from '../graphics/color';
export interface RenderComponentTemplate extends Template {
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

        // this._color = new Color(Math.random(), Math.random(), Math.random(), 1);

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
        this._oldRenderState.wasDirty = true;
        this._renderState.wasDirty = true;
    }

    public updateTransform() {
        // TODO: Removed this since it should not be needed...
        // this._renderState.wasDirty = true;
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

        this._renderedMatrix.values[Value.a] = interpolate(m1[Value.a], m2[Value.a], delta);
        this._renderedMatrix.values[Value.b] = interpolate(m1[Value.b], m2[Value.b], delta);
        this._renderedMatrix.values[Value.c] = interpolate(m1[Value.c], m2[Value.c], delta);
        this._renderedMatrix.values[Value.d] = interpolate(m1[Value.d], m2[Value.d], delta);
        this._renderedMatrix.values[Value.tx] = interpolate(m1[Value.tx], m2[Value.tx], delta) | 0;
        this._renderedMatrix.values[Value.ty] = interpolate(m1[Value.ty], m2[Value.ty], delta) | 0;
    }

    public isVisible():boolean {
        return this.visible && this.alpha > 0;
    }
}
ComponentFactory.register(RenderComponent);
