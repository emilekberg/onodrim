import System from '../system';
import Camera2D from '../../components/camera2d';

export default class CameraSystem extends System<Camera2D> {
	public static MAIN: Camera2D;
	constructor() {
		super();
	}
}
