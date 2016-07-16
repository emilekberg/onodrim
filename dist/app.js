System.register(['./game-object', './components/transform-component', './components/graphics-component', './core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var game_object_1, transform_component_1, graphics_component_1, core_1;
    var core, entity, g, entity2, g2;
    return {
        setters:[
            function (game_object_1_1) {
                game_object_1 = game_object_1_1;
            },
            function (transform_component_1_1) {
                transform_component_1 = transform_component_1_1;
            },
            function (graphics_component_1_1) {
                graphics_component_1 = graphics_component_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            core = new core_1.default();
            entity = new game_object_1.default();
            entity.addComponent(new transform_component_1.default(entity));
            entity.addComponent(new graphics_component_1.default(entity));
            g = entity.getComponent(graphics_component_1.default);
            g.width = 10;
            g.height = 200;
            entity2 = new game_object_1.default();
            entity2.addComponent(new transform_component_1.default(entity2));
            entity2.addComponent(new graphics_component_1.default(entity2));
            g2 = entity2.getComponent(graphics_component_1.default);
            g2.width = 20;
            g2.height = 20;
            g2.color = 'rgb(0,200,0)';
            entity.getComponent(transform_component_1.default).x = 100;
            entity2.getComponent(transform_component_1.default).x = 0;
            entity2.getComponent(transform_component_1.default).y = 0;
            //entity.getComponent<TransformComponent>(TransformComponent).addChild(entity2.getComponent<TransformComponent>(TransformComponent));
            core.start();
        }
    }
});
