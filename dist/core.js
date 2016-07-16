System.register(['./systems/render-system', './components/transform-component', './time'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var render_system_1, transform_component_1, time_1;
    var Core;
    return {
        setters:[
            function (render_system_1_1) {
                render_system_1 = render_system_1_1;
            },
            function (transform_component_1_1) {
                transform_component_1 = transform_component_1_1;
            },
            function (time_1_1) {
                time_1 = time_1_1;
            }],
        execute: function() {
            Core = class Core {
                constructor() {
                    this.fixedUpdateTime = 1 / 30;
                    this.currentFixedUpdateTime = time_1.default.now();
                    this.nextFixedUpdateTime = this.currentFixedUpdateTime + this.fixedUpdateTime;
                    this.renderer = new render_system_1.default();
                    this.tick = this.tick.bind(this);
                }
                start() {
                    requestAnimationFrame(this.tick);
                }
                tick() {
                    time_1.default.update();
                    if (time_1.default.now() >= this.nextFixedUpdateTime) {
                        time_1.default.setFixedUpdateTime(this.fixedUpdateTime);
                        this._fixedUpdate();
                        this.nextFixedUpdateTime += this.fixedUpdateTime;
                    }
                    this._update();
                    this._render();
                    requestAnimationFrame(this.tick);
                }
                _fixedUpdate() {
                    for (let i = 0; i < Core.Entities.length; i++) {
                        let transform = Core.Entities[i].getComponent(transform_component_1.default);
                        if (transform) {
                            if (!transform.hasParent())
                                transform.fixedUpdate(false);
                        }
                        else {
                            Core.Entities[i].fixedUpdate();
                        }
                    }
                }
                _update() {
                    for (let i = 0; i < Core.Entities.length; i++) {
                        let transform = Core.Entities[i].getComponent(transform_component_1.default);
                        if (transform) {
                            transform.update();
                        }
                        else {
                            Core.Entities[i].update();
                        }
                    }
                }
                _render() {
                    let delta = (this.nextFixedUpdateTime - time_1.default.now()) / this.fixedUpdateTime;
                    this.renderer.render(delta);
                }
            };
            Core.Entities = [];
            exports_1("default", Core);
        }
    }
});
