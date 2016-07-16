System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Point;
    return {
        setters:[],
        execute: function() {
            Point = class Point {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
                isZero() {
                    return !!(this.x || this.y);
                }
            };
            exports_1("default", Point);
        }
    }
});
