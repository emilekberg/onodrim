import Component, {Template, UpdateComponent } from './components/component';
export interface EntityTemplate {
    components: any[];
}
export default class Entity {
    protected _id:number;
    protected _components:Component[];
    protected _updateComponent: UpdateComponent[];
    protected _fixedUpdateComponent: UpdateComponent[];
    protected _name:string;
    protected _isInWorld:boolean;

    constructor() {
        this._name = 'entity';
        this._components = [];
        this._updateComponent = [];
        this._fixedUpdateComponent = [];
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
        if((component as UpdateComponent).update) {
            this._updateComponent.push(component as UpdateComponent);
        }
        if((component as UpdateComponent).fixedUpdate) {
            this._fixedUpdateComponent.push(component as UpdateComponent);
        }
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
        const components = new Array<T>();
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

    public getAllUpdateComponents(): UpdateComponent[] {
        return this._updateComponent;
    }

    public getAllFixedUpdateComponents(): UpdateComponent[] {
        return this._fixedUpdateComponent;
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
