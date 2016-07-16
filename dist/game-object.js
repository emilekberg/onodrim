System.register(['./entity', './components/transform-component', './time'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var entity_1, transform_component_1, time_1;
    var GameObject;
    return {
        setters:[
            function (entity_1_1) {
                entity_1 = entity_1_1;
            },
            function (transform_component_1_1) {
                transform_component_1 = transform_component_1_1;
            },
            function (time_1_1) {
                time_1 = time_1_1;
            }],
        execute: function() {
            GameObject = class GameObject extends entity_1.default {
                constructor() {
                    super();
                    this.transform = new transform_component_1.default(this);
                    this.addComponent(this.transform);
                }
                fixedUpdate() {
                    this.transform.rotation += time_1.default.deltaTime;
                    this.transform.x = Math.sin((performance.now() / 1000)) * 100;
                }
            };
            exports_1("default", GameObject);
        }
    }
});
