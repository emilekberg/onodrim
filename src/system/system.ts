import Component from '../components/component';
interface System {
    systemType:string;
    addComponentInstance(component:Component):void;
}
export default System;
