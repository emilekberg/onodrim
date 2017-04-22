import {Entity, Components} from 'onodrim';
export default class GameObject extends Entity {
	public transform:Components.Transform2D;
	constructor() {
		super();
		this.addComponent(new Components.Transform2D(this));
		this.transform = this.getComponent(Components.Transform2D);
	}
}
