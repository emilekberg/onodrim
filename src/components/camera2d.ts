import Component from './component';
import ComponentFactory from './component-factory';
import Entity from '../entity';
import Matrix from '../math/matrix3';
import Point from '../math/point';
import SystemManager from '../system/system-manager';
import CameraSystem from '../system/camera/camera-system';
import Transform2D from './transform2d';
import { interpolateMatrix } from '../math/interpolation';

export default class Camera2D extends Component {
	public readonly matrix: Matrix;
	private readonly _matrix: Matrix;
	private readonly _previousMatrix: Matrix;
	private readonly _projectionMatrix: Matrix;
	private readonly _viewMatrix: Matrix;
	private _viewport: Point;
	private _transform: Transform2D;

	public get isDirty(): boolean {
		return this._transform.isDirty || this._transform.wasDirty;
	}

	constructor(entity: Entity) {
		super(entity);
		this.matrix = new Matrix();
		this._matrix = new Matrix();
		this._previousMatrix = new Matrix();
		this._projectionMatrix = new Matrix();
		this._viewMatrix = new Matrix();
		this._viewport = new Point();
		const transform = this._entity.getComponent(Transform2D);
		if (transform) {
			this._transform = transform;
		}
		const cameraSystem = SystemManager.getSystem(CameraSystem);
		if (cameraSystem) {
			cameraSystem.addComponentInstance(this);
			CameraSystem.MAIN = this;
		}
	}

	public fixedUpdate() {
		this._previousMatrix.copy(this._matrix);
		if (this.isDirty) {
			this.updateViewMatrix();
			this._matrix.copy(this._viewMatrix)
				.translate(this._viewport.x * 0.5, this._viewport.y * 0.5);
		}
	}

	public setViewport(width: number, height: number) {
		this._viewport.set(width, height);
		this.updateProjectionMatrix();
		this.updateViewMatrix();
	}

	public interpolateMatrix(delta: number) {
		interpolateMatrix(this.matrix, this._previousMatrix, this._matrix, delta);
		this.matrix.multiply(this._projectionMatrix);
	}

	private updateProjectionMatrix() {
		this._projectionMatrix.identity()
			.scale(1/this._viewport.x, 1/this._viewport.y)
			// Moves origo to be at the edge of the screen instead of center. (bottom right)
			.scale(2, 2)
			.translate(-1, -1)
			// Inverse coordinates, top left = 0, 0
			.scale(1, -1);
	}

	private updateViewMatrix() {
		this._viewMatrix.identity()
			.translate(-this._transform.worldX, -this._transform.worldY)
			.scale(this._transform.worldScaleX, this._transform.worldScaleY)
			.rotate(this._transform.worldRotation);
	}
}
ComponentFactory.register(Camera2D, 'onodrim.camera2d');
