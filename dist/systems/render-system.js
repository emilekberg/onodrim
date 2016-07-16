System.register(['../components/render-component', '../core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var render_component_1, core_1;
    var RenderSystem;
    return {
        setters:[
            function (render_component_1_1) {
                render_component_1 = render_component_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            RenderSystem = class RenderSystem {
                constructor() {
                    this.canvas = document.createElement('Canvas');
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
                    for (let i = 0; i < core_1.default.Entities.length; i++) {
                        let renderer = core_1.default.Entities[i].getComponent(render_component_1.default);
                        if (renderer) {
                            renderer.render(delta, this.ctx);
                        }
                    }
                }
            };
            exports_1("default", RenderSystem);
        }
    }
});
