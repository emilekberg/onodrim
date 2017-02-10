import Component from './components/component';

export default class Entity {
    protected _id:number;
    protected _components:Component[];
    protected _name:string;
    protected _isInWorld:boolean;

    constructor() {
        this._name = 'entity';
        this._components = [];
        this._isInWorld = false;
    }

    public addedToWorld() {
        this._isInWorld = true;
    }

    public removedFromWorld() {
        this._isInWorld = false;
    }

    public isInWorld():boolean {
        return this._isInWorld;
    }

    public addComponent(component:Component) {
        component.setEntity(this);
        this._components.push(component);
    }

    public hasComponent(componentType:Function):boolean {
        for(let i = 0; i < this._components.length; ++i) {
            if(this._components[i] instanceof (componentType)) {
                return true;
            }
        }
        return false;
    }

    public getComponent<T extends Component>(componentType:{ new (...args:any[]):T;}):T|null {
        for(let i = 0; i < this._components.length; ++i) {
            if(this._components[i] instanceof (componentType)) {
                return this._components[i] as T;
            }
        }
        return null;
    }

    public getComponents<T extends Component>(componentType:{ new (...args:any[]):T;}):T[] {
        let components = new Array<T>();
        for(let i = 0; i < this._components.length; ++i) {
            if(this._components[i] instanceof (componentType)) {
                components.push(this._components[i] as T);
            }
        }
        return components;
    }

    public getAllComponents():Component[] {
        return this._components;
    }

    // Called at 30fps
    public fixedUpdate() {
        // TODO: implement
    }

    // Called at render speed
    public update() {
        // TODO: implement
    }
}
