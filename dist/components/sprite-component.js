System.register(['./render-component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var render_component_1;
    var SpriteComponent;
    return {
        setters:[
            function (render_component_1_1) {
                render_component_1 = render_component_1_1;
            }],
        execute: function() {
            SpriteComponent = class SpriteComponent extends render_component_1.default {
                constructor(entity) {
                    super(entity);
                }
                fixedUpdate() {
                }
                render(delta, ctx) {
                    super.render(delta, ctx);
                }
            };
            exports_1("default", SpriteComponent);
        }
    }
});
