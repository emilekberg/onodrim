import ComponentFactory from './component-factory';
import Component, {Template} from './component';
import Transform2D from './transform2d';
import Entity from '../entity';
import Matrix3, {Value} from '../math/matrix3';
import WebGLSystem from '../system/webgl/webgl-system';
import RenderBatch from '../system/webgl/batching/render-batch';
import SystemManager from '../system/system-manager';
import { interpolateMatrix } from '../math/interpolation';
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
		this._depth = template.depth || 0;
		this.alpha = template.alpha || 1;
		this.visible = template.visible || true;
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
		this._renderState.matrix = this._transform.worldMatrix;
	}

	public render(delta:number, gl:WebGL2RenderingContext, batch:RenderBatch) {
		this.interpolateRenderMatrix(delta);
	}

	public interpolateRenderMatrix(delta:number) {
		if(!this._renderState.wasDirty && !this._oldRenderState.wasDirty) {
			return;
		}
		interpolateMatrix(this._renderedMatrix, this._oldRenderState.matrix, this._renderState.matrix, delta);
	}

	public isVisible():boolean {
		return this.visible && this.alpha > 0;
	}
}
ComponentFactory.register(RenderComponent, 'onodrim.render-component');
