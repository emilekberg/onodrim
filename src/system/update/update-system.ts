import System, { TickSystem } from '../system';
import { UpdateComponent } from '../../components/component';
import Time from '../../time';

export default class UpdateSystem extends System<UpdateComponent> implements TickSystem<UpdateComponent> {

	public canProcessComponent(component: UpdateComponent): boolean {
		return component.update !== undefined;
	}

	public tick(): void {
		Time.update();
		const l = this._components.length;
		for(let i = 0; i < l; ++i) {
			if (this._components[i].isActive) {
				this._components[i].update();
			}
		}
	}
}
