import Entity from './entity'
import TransformComponent from './components/transform-component'
import Time from './time'
export default class GameObject extends Entity {
    transform:TransformComponent;
    constructor() {
        super();
        this.transform = new TransformComponent(this)
        this.addComponent(this.transform);
        
    }

    fixedUpdate() {
        //this.transform.rotation += Time.deltaTime;
        //this.transform.x = 400 +(Math.sin((performance.now()/1000)) * 100);
    }
}