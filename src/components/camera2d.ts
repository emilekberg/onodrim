import Component from './component';
import ComponentFactory from './component-factory';
import Entity from '../entity';
import Matrix from '../math/matrix3';
import Point from '../math/point';
import SystemManager from '../system/system-manager';
import CameraSystem from '../system/camera/camera-system';
import Transform2D from './transform2d';

export default class Camera2D extends Component {
    public readonly projectionMatrix: Matrix;
    public readonly viewMatrix: Matrix;
    private _viewport: Point;
    private _transform: Transform2D;
    constructor(entity: Entity) {
        super(entity);
        this.projectionMatrix = new Matrix();
        this.viewMatrix = new Matrix();
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
        if (true || this._transform.isDirty) {
            this.viewMatrix.identity()
                .translate(-this._transform.worldX, -this._transform.worldY)
                .scale(this._transform.worldScaleX, this._transform.worldScaleY)
                .rotate(this._transform.worldRotation);
        }
    }

    public setViewPort(width: number, height: number) {
        this._viewport.set(width, height);
        this.updateProjectionMatrix();
    }

    private updateProjectionMatrix() {
        this.projectionMatrix.identity()
            .scale(1/this._viewport.x, 1/this._viewport.y)
            // Moves origo to be at the edge of the screen instead of center. (bottom right)
            .scale(2, 2)
            .translate(-1, -1)
            // Inverse coordinates, top left = 0, 0
            .scale(1, -1);
    }
}
ComponentFactory.register(Camera2D, 'onodrim.camera2d');
