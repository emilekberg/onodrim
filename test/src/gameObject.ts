import {Entity, Components} from "onodrim";
export default class GameObject extends Entity {
    public transform:Components.Transform2DComponent;
    constructor() {
        super();
        this.addComponent(new Components.Transform2DComponent(this));
        this.transform = this.getComponent(Components.Transform2DComponent);
    }
}
