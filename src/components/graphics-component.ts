import RenderComponent from './render-component'
import Entity from '../entity'
export default class GraphicsComponent extends RenderComponent {

    color:string;
    x:number;
    y:number;
    width:number;
    height:number;
    constructor(entity:Entity) {
        super(entity);
        this.color = 'rgb(200,0,0)';
    }

    fixedUpdate() {

    }
    render(delta:number, ctx:CanvasRenderingContext2D) {
        if(!this.isVisible()) {
            return;
        }
        this.interpolateRenderMatrix(delta, ctx);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.height);
        ctx.lineTo(this.width, this.height);
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        ctx.closePath();
        this.requireDepthSort = false;
    }
}