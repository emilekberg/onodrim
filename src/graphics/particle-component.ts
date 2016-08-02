import RenderComponent, {RenderComponentTemplate} from '../components/render-component'
import Entity from '../entity'
import ParticleSystem from './particle-system'
export interface ParticleComponentTemplate extends RenderComponentTemplate {
    x?:number;
    y?:number;
    system?:ParticleSystem
}
export default class ParticleComponent extends RenderComponent {
    system:ParticleSystem;
    constructor(entity:Entity, template:ParticleComponentTemplate = {}) {
        super(entity, template);
        this.system = template.system;
    }
    fixedUpdate() {
        this.system.fixedUpdate();
        for(let i = 0; i < this.system.activeParticles.length; i++) {
            this.system.activeParticles[i].transform.fixedUpdate();
            this.system.activeParticles[i].renderComponent.fixedUpdate();
        }
        
    }
    update() {
        this.system.update();
    }
    render(delta, ctx:CanvasRenderingContext2D) {
        for(let i = 0; i < this.system.activeParticles.length; i++) {
            let renderer = this.system.activeParticles[i].renderComponent;
            if(renderer) {
                renderer.render(delta, ctx);
            }
        }
    }
    renderWebGL(delta:number, gl:WebGLRenderingContext) {
        for(let i = 0; i < this.system.activeParticles.length; i++) {
            let renderer = this.system.activeParticles[i].renderComponent;
            if(renderer) {
                renderer.renderWebGL(delta, gl);
            }
        }
    }
}