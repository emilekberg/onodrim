import Component, {Template} from './component';
import Entity from '../entity';
export interface TransformTemplate extends Template {

}
abstract class Transform extends Component {
    protected _children:Transform[];
    protected _parent:Transform|null;
    constructor(entity:Entity, template: TransformTemplate) {
        super(entity);

        this._children = new Array<Transform>();
        this._parent = null;
        // TODO: implement
    }

    public fixedUpdate(): void {
        // TODO: implement
    }
    public update(): void {
        // TODO: implement
    }

    public get parent():Transform|null {
        return this._parent;
    }

    public addChild(child:Transform): void {
        // TODO: Find out why not, it seems to work...
        // console.warn('Transform.addChild(): is not fully implemented yet');
        if(this.isChild(child)) {
            return;
        }
        this._children.push(child);
        if(child._parent !== null) {
            child._parent.removeChild(child);
        }
        child._parent = this;
    }
    public removeChild(child:Transform): void {
        // TODO: Find out why not, it seems to work...
        // console.warn('Transform.removeChild(): is not fully implemented yet');
        const index = this._children.indexOf(child);
        if(index === -1) {
            return;
        }
        this._children.splice(index, 1);
        child._parent = null;
    }
    public isChild(transform:Transform):boolean {
        return this._children.indexOf(transform) !== -1;
    }
    public hasParent():boolean {
        return this._parent !== null;
    }
}
export default Transform;
