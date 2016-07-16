System.register(['./core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var Entity;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Entity = class Entity {
                constructor() {
                    this._id = core_1.default.Entities.push(this) - 1;
                    this._components = [];
                }
                addComponent(component) {
                    component.setEntity(this);
                    this._components.push(component);
                }
                hasComponent(componentType) {
                    for (let i = 0; i < this._components.length; i++) {
                        if (this._components[i] instanceof componentType) {
                            return true;
                        }
                    }
                    return false;
                }
                getComponent(componentType) {
                    for (let i = 0; i < this._components.length; i++) {
                        if (this._components[i] instanceof componentType) {
                            return this._components[i];
                        }
                    }
                    return null;
                }
                getComponents(componentType) {
                    var components = new Array();
                    for (let i = 0; i < this._components.length; i++) {
                        if (this._components[i] instanceof componentType) {
                            components.push(this._components[i]);
                        }
                    }
                    return components;
                }
                //Called at 30fps
                fixedUpdate() {
                }
                //Called at render speed
                update() {
                }
            };
            exports_1("default", Entity);
        }
    }
});
