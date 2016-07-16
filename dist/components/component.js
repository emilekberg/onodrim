System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Component;
    return {
        setters:[],
        execute: function() {
            Component = class Component {
                constructor(entity) {
                    this._requiredComponents = new Array();
                    this.setEntity(entity);
                }
                setEntity(entity) {
                    this._entity = entity;
                    this._checkRequiredComponents();
                }
                _checkRequiredComponents() {
                    for (let i = 0; i < this._requiredComponents.length; i++) {
                        if (!this._entity.hasComponent(this._requiredComponents[i])) {
                            console.error(this._entity.constructor.name, "is missing required component", this._requiredComponents[i].name.toString());
                        }
                    }
                }
            };
            exports_1("default", Component);
        }
    }
});
