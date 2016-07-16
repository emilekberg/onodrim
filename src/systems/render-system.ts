import RenderComponent from '../components/render-component'
import Core from '../core'
export default class RenderSystem {
    ctx:CanvasRenderingContext2D;
    canvas:HTMLCanvasElement;
    width:number;
    height:number;
    constructor() {
        this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        document.body.appendChild(this.canvas);
    }

    render(delta) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = 'black';
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i < Core.Entities.length; i++) {
            let renderer = Core.Entities[i].getComponent<RenderComponent>(RenderComponent);
            if (renderer) {
                renderer.render(delta, this.ctx);
            }
        }
    }
}