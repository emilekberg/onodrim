import Component from './component';
import ComponentFactory from './component-factory';
import Entity from '../entity';
import Matrix from '../math/matrix3';
import Point from '../math/point';
import SystemManager from '../system/system-manager';
import CameraSystem from '../system/camera/camera-system';


export default class Camera2D extends Component {
    public readonly projectionMatrix: Matrix;
    private _viewport: Point;
    constructor(entity: Entity) {
        super(entity);
        this.projectionMatrix = new Matrix();
        this._viewport = new Point();

        const cameraSystem = SystemManager.getSystem(CameraSystem);
        if (cameraSystem) {
            cameraSystem.addComponentInstance(this);
            CameraSystem.MAIN = this;
        }
    }

    public setViewPort(width: number, height: number) {
        this._viewport.set(width, height);
        this.updateProjectionMatrix();
    }

    private updateProjectionMatrix() {
        this.projectionMatrix.identity()
            .scale(1/this._viewport.x, 1/this._viewport.y)
            .scale(2, 2)
            .translate(-1, -1)
            .scale(1, -1);
    }
}
ComponentFactory.register(Camera2D, 'onodrim.camera2d');
