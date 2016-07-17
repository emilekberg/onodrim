import Component from './component'
import TransformComponent from './transform-component'
import Entity from '../entity'
export default class RenderComponent extends Component {
    protected _transform:TransformComponent;
    
    constructor(entity:Entity) {
        super(entity);
        this._transform = this._entity.getComponent<TransformComponent>(TransformComponent);

    }

    render(delta:number, ctx:CanvasRenderingContext2D) {
        let m1 = this._transform.previousTransform;
        let m2 = this._transform.transform;
        //ctx.setTransform(m1.a, m1.b, m1.c, m1.d, m1.tx, m1.ty);
        //return;
        var a, b, c, d, tx, ty;
        a = this.lerp(delta, m1.a, m1.a-m2.a, 1);
        b = this.lerp(delta, m1.b, m1.b-m2.b, 1);
        c = this.lerp(delta, m1.c, m1.c-m2.c, 1);
        d = this.lerp(delta, m1.d, m1.d-m2.d, 1);
        tx = this.lerp(delta, m1.tx, m1.tx-m2.tx, 1);
        ty = this.lerp(delta, m1.ty, m1.ty-m2.ty, 1);
        ctx.setTransform(a,b,c,d,tx,ty);
    }   
    lerp(t:number, b:number, c:number, d:number):number {
        return b + (c * (t / d));
    };
}