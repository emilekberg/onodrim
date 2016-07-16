import Component from './components/component'
import Core from './core'
export default class Entity {
    protected _id:number;
    protected _components:Array<Component>;
    protected _name:string;
    constructor() {
        this._id = Core.Entities.push(this)-1;
        this._components = [];
    }

    addComponent(component:Component) {
        component.setEntity(this);
        this._components.push(component);
    }
    hasComponent(componentType:Function):boolean {
        for(let i = 0; i < this._components.length; i++) {
            if (this._components[i] instanceof (componentType as any)) {
                return true;
            }
        }
        return false;
    }
    getComponent<T extends Component>(componentType:any):T {
        for(let i = 0; i < this._components.length; i++) {
            if (this._components[i] instanceof (componentType as any)) {
                return this._components[i] as T;
            }
        }
        return null;
    }
    getComponents<T extends Component>(componentType:Component):Array<T> {
        var components = new Array<T>();
        for(let i = 0; i < this._components.length; i++) {
            if (this._components[i]instanceof (componentType as any)) {
                components.push(this._components[i] as T);
            }
        }
        return components;
    }

    //Called at 30fps
    fixedUpdate() {
        
    }

    //Called at render speed
    update() {

    }
    
}