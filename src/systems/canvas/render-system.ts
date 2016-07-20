import RenderComponent from '../../components/render-component'
import Core from '../../core'
import Scene from '../../scene'
export default class RenderSystem {
    static Renderers:Array<RenderComponent> = [];
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
        let resort = false;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = 'black';
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i < Scene.CurrentScene.renderers.length; i++) {
            let renderer = Scene.CurrentScene.renderers[i];
            if(renderer) {
                if(renderer.requireDepthSort && !resort) {
                    resort = true;
                }
                renderer.render(delta, this.ctx);
            }
        }
        if(resort) {
             Scene.CurrentScene.renderers.sort((a, b) => {
                 if(a.depth > b.depth) {
                     return 1;
                 }
                 if(a.depth < b.depth) {
                     return -1;
                 }
                 return 0;
             })
        }
    }
}