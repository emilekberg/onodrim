import RenderComponent, {RenderComponentTemplate} from '../components/render-component';
import Entity from '../entity';
import ParticleSystem from './particle-system';
import SpriteBatch from '../system/webgl/sprite-batch';
export interface ParticleComponentTemplate extends RenderComponentTemplate {
    x?:number;
    y?:number;
    system:ParticleSystem;
}
export default class ParticleComponent extends RenderComponent {
    public system:ParticleSystem;
    constructor(entity:Entity, template:ParticleComponentTemplate) {
        super(entity, template);
        this.system = template.system;
    }
    public fixedUpdate() {
        this.system.fixedUpdate();
        for(let i = 0; i < this.system.activeParticles.length; ++i) {
            this.system.activeParticles[i].transform.fixedUpdate();
            this.system.activeParticles[i].renderComponent.fixedUpdate();
        }
    }

    public update() {
        this.system.update();
    }

    public render(delta:number, gl:WebGLRenderingContext, batch:SpriteBatch) {
        for(let i = 0; i < this.system.activeParticles.length; ++i) {
            const renderer = this.system.activeParticles[i].renderComponent;
            if(renderer) {
                renderer.render(delta, gl, batch);
            }
        }
    }
}
