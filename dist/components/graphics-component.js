System.register(['./render-component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var render_component_1;
    var GraphicsComponent;
    return {
        setters:[
            function (render_component_1_1) {
                render_component_1 = render_component_1_1;
            }],
        execute: function() {
            GraphicsComponent = class GraphicsComponent extends render_component_1.default {
                constructor(entity) {
                    super(entity);
                    this.color = 'rgb(200,0,0)';
                }
                fixedUpdate() {
                }
                render(delta, ctx) {
                    super.render(delta, ctx);
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, this.height);
                    ctx.lineTo(this.width, this.height);
                    ctx.lineTo(this.width, 0);
                    ctx.stroke();
                    ctx.closePath();
                }
            };
            exports_1("default", GraphicsComponent);
        }
    }
});
