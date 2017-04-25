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
		if (Onodrim.Input.isDown(Onodrim.KeyCode.Q)) {
			this._transform.rotation += Onodrim.Time.deltaTime;
		}
		else if (Onodrim.Input.isDown(Onodrim.KeyCode.E)) {
			this._transform.rotation -= Onodrim.Time.deltaTime;
		}
		if (Onodrim.Input.isDown(Onodrim.KeyCode.Z)) {
			this._transform.scaleX += Onodrim.Time.deltaTime;
			this._transform.scaleY += Onodrim.Time.deltaTime;
		}
		else if (Onodrim.Input.isDown(Onodrim.KeyCode.X)) {
			this._transform.scaleX -= Onodrim.Time.deltaTime;
			this._transform.scaleY -= Onodrim.Time.deltaTime;
		}
		if (Onodrim.Input.isDown(Onodrim.KeyCode.MouseLeft)) {
			console.log(Onodrim.Input.mouseX, Onodrim.Input.mouseY);
		}
	}
}
Onodrim.Components.ComponentFactory.register(PlayerController, 'PlayerController');
