import System, { TickSystem } from '../system';
import Collider from '../../components/collider';
import Point from '../../math/point';

export default class UpdateSystem extends System<Collider> {

	public canProcessComponent(component: Collider): boolean {
		return component instanceof Collider;
	}

	public checkCollisionAABB(a: Collider, b: Collider): boolean {
		if (a.x < b.x + b.w &&
			a.x + a.w > b.x &&
			a.y < b.y + b.h &&
			a.y + a.h > b.y) {
			return true;
		}
		return false;
	}

	public checkPointInCollider(point: Point, collider: Collider): boolean {
		if (point.x >= collider.x && point.x <= collider.x + collider.w &&
			point.y >= collider.y && point.y <= collider.y + collider.h) {
			return true;
		}
		return false;
	}
}
