import Entity from '../entity';
import ComponentFactory from './component-factory';
export interface Template {
    type?: string;
}
export interface UpdateComponent extends Component{
    update: () => void;
    fixedUpdate: () => void;
}
export default class Component {
    protected _entity:Entity;
    protected _requiredComponents:Function[];
    constructor(entity:Entity) {
        this._requiredComponents = [];
        this.setEntity(entity);
    }

    public setEntity(entity:Entity):void {
        this._entity = entity;
        // this._checkRequiredComponents();
    }

    public getEntity():Entity {
        return this._entity;
    }

    /*
    public fixedUpdate():void {
        // TODO: implement this
    }

    public update():void {
        // TODO: implement this
    }
    */

    public parseJSON(json:Object):void {
        // TODO: implement this
    }
    public getJSON():Object {
        return {
            // TODO: implement this
        };
    }

    /*private _checkRequiredComponents():void {
        for(let i = 0; i < this._requiredComponents.length; ++i) {
            if(!this._entity.hasComponent(this._requiredComponents[i])) {
                console.error(
                    this._entity.constructor.name,
                    'is missing required component',
                    this._requiredComponents[i].name.toString()
                );
            }
        }
    }*/
}
ComponentFactory.register(Component);
