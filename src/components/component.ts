import Entity from "../entity";
export default class Component {
    protected _entity:Entity;
    protected _requiredComponents:Array<Function>;
    constructor(entity:Entity) {
        this._requiredComponents = new Array<Function>();
        this.setEntity(entity);

    }

    public setEntity(entity:Entity):void {
        this._entity = entity;
        // this._checkRequiredComponents();
    }

    public fixedUpdate() {
        // TODO: implement this
    }

    public update() {
        // TODO: implement this
    }

    public parseJSON(json:Object) {
        // TODO: implement this
    }
    public getJSON():Object {
        return {
            // TODO: implement this
        };
    }

    /*private _checkRequiredComponents():void {
        for(let i = 0; i < this._requiredComponents.length; i++) {
            if(!this._entity.hasComponent(this._requiredComponents[i])) {
                console.error(
                    this._entity.constructor.name,
                    "is missing required component",
                    this._requiredComponents[i].name.toString()
                );
            }
        }
    }*/
}
