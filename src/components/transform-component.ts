import Component from "./component";
import Entity from "../entity";
abstract class TransformComponent extends Component {
    protected _children:Array<TransformComponent>;
    protected _parent:TransformComponent;
    constructor(entity:Entity) {
        super(entity);

        this._children = new Array<TransformComponent>();
        // TODO: implement
    }

    public fixedUpdate() {
        // TODO: implement
    }
    public update() {
        // TODO: implement
    }

    public get parent():TransformComponent {
        return this._parent;
    }

    public addChild(child:TransformComponent) {
        console.warn("Transform.addChild(): is not fully implemented yet");
        if(this.isChild(child)) {
            return;
        }
        this._children.push(child);
        if(child.hasParent()) {
            child._parent.removeChild(child);
        }
        child._parent = this;
    }
    public removeChild(child:TransformComponent) {
        console.warn("Transform.removeChild(): is not fully implemented yet");
        let index = this._children.indexOf(child);
        if(index === -1) {
            return;
        }
        this._children.splice(index, 1);
        child._parent = null;
    }
    public isChild(transform:TransformComponent):boolean {
        return this._children.indexOf(transform) !== -1;
    }
    public hasParent():boolean {
        return this._parent !== null;
    }
}
export default TransformComponent;
