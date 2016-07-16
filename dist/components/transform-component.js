System.register(['./component', '../math/point', '../math/matrix', '../math/constants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var component_1, point_1, matrix_1, constants_1;
    var TransformComponent;
    return {
        setters:[
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (point_1_1) {
                point_1 = point_1_1;
            },
            function (matrix_1_1) {
                matrix_1 = matrix_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }],
        execute: function() {
            TransformComponent = class TransformComponent extends component_1.default {
                constructor(entity) {
                    super(entity);
                    this._children = new Array();
                    this._position = new point_1.default(0, 0);
                    this._origo = new point_1.default(0, 0);
                    this._scale = new point_1.default(1, 1);
                    this._parent = null;
                    this._rotation = 0;
                    this._rotationCache = 0;
                    this._cr = 1;
                    this._sr = 1;
                    this._transform = new matrix_1.default();
                    this._previousTransform = new matrix_1.default();
                }
                static get IDENTITY() {
                    return [1, 0, 0, 1, 0, 0];
                }
                get position() {
                    return this._position;
                }
                set position(value) {
                    this._position = value;
                    this._isDirty = true;
                }
                get x() {
                    return this._position.x;
                }
                set x(value) {
                    this._position.x = value;
                    this._isDirty = true;
                }
                get y() {
                    return this._position.y;
                }
                set y(value) {
                    this._position.y = value;
                    this._isDirty = true;
                }
                get scale() {
                    return this._scale;
                }
                set scale(value) {
                    this._scale = value;
                    this._isDirty = true;
                }
                get scaleX() {
                    return this._scale.x;
                }
                set scaleX(value) {
                    this._scale.x = value;
                    this._isDirty = true;
                }
                get scaleY() {
                    return this._scale.y;
                }
                set scaleY(value) {
                    this._scale.y = value;
                    this._isDirty = true;
                }
                get origo() {
                    return this._origo;
                }
                set origo(value) {
                    this._origo = value;
                    this._isDirty = true;
                }
                set rotation(value) {
                    this._rotation = value;
                    this._isDirty = true;
                }
                get rotation() {
                    return this._rotation;
                }
                get transform() {
                    return this._transform;
                }
                get previousTransform() {
                    return this._previousTransform;
                }
                addChild(child) {
                    if (this.isChild(child)) {
                        return;
                    }
                    this._children.push(child);
                    if (child.hasParent()) {
                        child._parent.removeChild(child);
                    }
                    child._parent = this;
                }
                removeChild(child) {
                    let index = this._children.indexOf(child);
                    if (index === -1) {
                        return;
                    }
                    this._children.splice(index, 1);
                    child._parent = null;
                }
                isChild(transform) {
                    return this._children.indexOf(transform) != -1;
                }
                hasParent() {
                    return this._parent != null;
                }
                fixedUpdate(dirty) {
                    this._isDirty = this._isDirty || dirty;
                    this._entity.fixedUpdate();
                    this._previousTransform.copyFrom(this._transform);
                    if (this._isDirty) {
                        this.updateTransform();
                    }
                    for (let i = 0; i < this._children.length; i++) {
                        this._children[i].fixedUpdate(this._isDirty);
                    }
                    this._isDirty = false;
                }
                update() {
                    this._entity.update();
                    for (let i = 0; i < this._children.length; i++) {
                        this._children[i].update();
                    }
                }
                updateTransform() {
                    var a, b, c, d, tx, ty;
                    var pt = this._parent ? this._parent._transform : matrix_1.default.Identity;
                    //var wt = this._transform;
                    if (this._rotation % constants_1.default.PI_2) {
                        if (this._rotation !== this._rotationCache) {
                            this._rotationCache = this._rotation;
                            this._sr = Math.sin(this._rotation);
                            this._cr = Math.cos(this._rotation);
                        }
                        a = this._cr * this._scale.x;
                        b = this._sr * this._scale.x;
                        c = this._sr * this._scale.y;
                        d = this._cr * this._scale.y;
                        tx = this._position.x;
                        ty = this._position.y;
                        if (this._origo.isZero()) {
                            tx -= this._origo.x * a + this._origo.y * c;
                            ty -= this._origo.x * b * this._origo.y * d;
                        }
                        this._transform.a = a * pt.a + b * pt.c;
                        this._transform.b = a * pt.b + b * pt.d;
                        this._transform.c = c * pt.a + d * pt.c;
                        this._transform.d = c * pt.b + d * pt.d;
                        this._transform.tx = tx * pt.a + ty * pt.c + pt.tx;
                        this._transform.ty = tx * pt.b + ty * pt.d + pt.ty;
                    }
                    else {
                        a = this._scale.x;
                        d = this._scale.y;
                        tx = this._position.x - this._origo.x * a;
                        ty = this._position.y - this._origo.y * d;
                        this._transform.a = a * pt.a;
                        this._transform.b = a * pt.b;
                        this._transform.c = d * pt.c;
                        this._transform.d = d * pt.d;
                        this._transform.tx = tx * pt.a + ty * pt.c + pt.tx;
                        this._transform.ty = tx * pt.b + ty * pt.d + pt.ty;
                    }
                    /*this._nextTransform.set(this._scale.x, this._rotation, this._rotation, this._scale.y, this._position.x, this._position.y);
                    if (this._parent) {
                        this._nextTransform.merge(this._parent.nextTransform)
                    }*/
                }
            };
            exports_1("default", TransformComponent);
        }
    }
});
