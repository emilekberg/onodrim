import * as Onodrim from 'onodrim';

export default class PlayerController extends Onodrim.Components.Component {
	private _transform: Onodrim.Components.Transform2D;
	constructor(entity: Onodrim.Entity) {
		super(entity);

		this._transform = entity.getComponent(Onodrim.Components.Transform2D);
	}

	public fixedUpdate() {
		if (Onodrim.Input.isDown(Onodrim.KeyCode.Up)) {
			this._transform.y -= 100 * Onodrim.Time.deltaTime;
		}
		else if (Onodrim.Input.isDown(Onodrim.KeyCode.Down)) {
			this._transform.y += 100 * Onodrim.Time.deltaTime;
		}
		if (Onodrim.Input.isDown(Onodrim.KeyCode.Left)) {
			this._transform.x -= 100 * Onodrim.Time.deltaTime;
		}
		else if (Onodrim.Input.isDown(Onodrim.KeyCode.Right)) {
			this._transform.x += 100 * Onodrim.Time.deltaTime;
		}
	}
}
Onodrim.Components.ComponentFactory.register(PlayerController, 'PlayerController');
