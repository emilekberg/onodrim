import Component from '../components/component';
export interface TickSystem<T extends Component> extends System<T> {
   tick(): void;
}
export abstract class System<T extends Component> {
    protected _componentInstances: T[];
    constructor() {
        this._componentInstances = [];
    }
    public canProcessComponent(component: Component): boolean {
       return false;
    }
    public addComponentInstance(componentInstance:T) {
        this._componentInstances.push(componentInstance);
    }
    public removeComponentInstance(componentInstance:T):void {
        const index = this._componentInstances.indexOf(componentInstance);
        if (index !== -1) {
            this._componentInstances.splice(index, 1);
        }
    }
}
export default System;
