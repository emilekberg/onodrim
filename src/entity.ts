import Component from './components/component'
import Core from './core'
export default class Entity {
    protected _id:number;
    protected _components:Array<Component>;
    protected _name:string;

    constructor() {
        //this._id = Core.Entities.push(this)-1;
        this._name = "entity";
        this._components = [];
    }

    addComponent(component:Component) {
        component.setEntity(this);
        this._components.push(component);
    }

    hasComponent(componentType:Function):boolean {
        for(let i = 0; i < this._components.length; i++) {
            if(this._components[i] instanceof (componentType)) {
                return true;
            }
        }
        return false;
    }

    getComponent<T extends Component>(componentType:{ new (...args:any[]):T;}):T {
        for(let i = 0; i < this._components.length; i++) {
            if(this._components[i] instanceof (componentType)) {
                return this._components[i] as T;
            }
        }
        return null;
    }

    getComponents<T extends Component>(componentType:{ new (...args:any[]):T;}):Array<T> {
        var components = new Array<T>();
        for(let i = 0; i < this._components.length; i++) {
            if(this._components[i] instanceof (componentType)) {
                components.push(this._components[i] as T);
            }
        }
        return components;
    }

    getAllComponents():Array<Component> {
        return this._components;
    }

    //Called at 30fps
    fixedUpdate() {
        
    }

    //Called at render speed
    update() {

    }
    
}