System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Time;
    return {
        setters:[],
        execute: function() {
            Time = class Time {
                static update() {
                    let now = performance.now();
                    this._deltaTimeMS = now - this._lastUpdateTime;
                    this._deltaTime = this._deltaTimeMS * 0.001;
                    this._lastUpdateTime = now;
                }
                static now() {
                    return performance.now() / 1000;
                }
                static get deltaTime() {
                    return this._deltaTime;
                }
                static get deltaTimeMS() {
                    return this._deltaTimeMS;
                }
                static get FPS() {
                    return 1 / this.deltaTime;
                }
                static setFixedUpdateTime(timestep) {
                    this._deltaTime = timestep;
                }
            };
            Time._deltaTime = 0;
            Time._deltaTimeMS = 0;
            Time._lastUpdateTime = performance.now();
            exports_1("default", Time);
        }
    }
});
