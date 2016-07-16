System.register(['./component', './transform-component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var component_1, transform_component_1;
    var RenderComponent;
    return {
        setters:[
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (transform_component_1_1) {
                transform_component_1 = transform_component_1_1;
            }],
        execute: function() {
            RenderComponent = class RenderComponent extends component_1.default {
                constructor(entity) {
                    super(entity);
                    this._transform = this._entity.getComponent(transform_component_1.default);
                }
                render(delta, ctx) {
                    let m1 = this._transform.previousTransform;
                    let m2 = this._transform.transform;
                    //ctx.setTransform(m1.a, m1.b, m1.c, m1.d, m1.tx, m1.ty);
                    var a, b, c, d, tx, ty;
                    a = this.lerp(delta, m1.a, m1.a - m2.a, 1);
                    b = this.lerp(delta, m1.b, m1.b - m2.b, 1);
                    c = this.lerp(delta, m1.c, m1.c - m2.c, 1);
                    d = this.lerp(delta, m1.d, m1.d - m2.d, 1);
                    tx = this.lerp(delta, m1.tx, m1.tx - m2.tx, 1);
                    ty = this.lerp(delta, m1.ty, m1.ty - m2.ty, 1);
                    ctx.setTransform(a, b, c, d, tx, ty);
                }
                lerp(t, b, c, d) {
                    return b + (c * (t / d));
                }
                ;
            };
            exports_1("default", RenderComponent);
        }
    }
});
