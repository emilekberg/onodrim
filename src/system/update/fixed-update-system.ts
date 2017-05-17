import System, { TickSystem } from '../system';
import { UpdateComponent } from '../../components/component';
import Time from '../../time';

export default class FixedUpdateSystem extends System<UpdateComponent> implements TickSystem<UpdateComponent> {
	public readonly updateRate: number;
	public currentUpdateTime: number;
	public nextUpdateTime: number;
	constructor() {
		super();
		this.updateRate = 1/30;
		this.currentUpdateTime = Time.now();
		this.nextUpdateTime = Time.now() + this.updateRate;
	}

	public canProcessComponent(component: UpdateComponent): boolean {
		return component.fixedUpdate !== undefined;
	}

	/**
	 * Updates the components added to this System. Also notifies if the system was compensated.
	 * TODO: Come up with a better solution. One solution would be to reset dirty flag after each
	 * game loop, however that would cause another loop of all the transformComponents...
	 */
	public tick(): void {
		Time.setFixedUpdateTime(this.updateRate);
		let numberOfFixedUpdates = 0;
		while(Time.now() >= this.nextUpdateTime) {
			const l = this._components.length;
			for(let i = 0; i < l; ++i) {
				if (this._components[i].isActive) {
					this._components[i].fixedUpdate(numberOfFixedUpdates++ > 0);
				}
			}
			this.currentUpdateTime = this.nextUpdateTime;
			this.nextUpdateTime += this.updateRate;
		}
	}
}
