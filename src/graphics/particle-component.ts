import Entity from '../entity';
import ParticleSystem from './particle-system';
import SpriteBatch from '../system/webgl/sprite-batch';
import Component, { Template } from "../components/component";
export interface ParticleComponentTemplate extends Template {
    system:ParticleSystem;
}
export default class ParticleComponent extends Component {
    public system:ParticleSystem;
    constructor(entity:Entity, template:ParticleComponentTemplate) {
        super(entity);
        this.system = template.system;
    }
    public fixedUpdate() {
        this.system.fixedUpdate();
    }

    public update() {
        this.system.update();
    }
}
