//heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/math/Matrix.js
export default class Matrix {
    static Identity:Matrix = new Matrix();
    a:number;
    b:number;
    c:number;
    d:number;
    tx:number;
    ty:number;
    constructor() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    }
    set(a:number,b:number,c:number,d:number,tx:number,ty:number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    }
    fromArray(values:Array<number>) {
        this.a = values[0];
        this.b = values[1];
        this.c = values[2];
        this.d = values[3];
        this.tx = values[4];
        this.ty = values[5];
        return this;
    }

    copyFrom(matrix:Matrix) {
        this.a = matrix.a;
        this.b = matrix.b;
        this.c = matrix.c;
        this.d = matrix.d;
        this.tx = matrix.tx;
        this.ty = matrix.ty; 
        return this;
    }
    merge(matrix:Matrix) {
        let arr = [6];
        arr[0] = this.a  * matrix.a + this.b  * matrix.c;
        arr[1] = this.a  * matrix.b + this.b  * matrix.d;
        arr[2] = this.c  * matrix.a + this.d  * matrix.c;
        arr[3] = this.c  * matrix.b + this.d  * matrix.d;
        arr[4] = this.tx * matrix.a + this.ty * matrix.c + matrix.tx;
        arr[5] = this.tx * matrix.b + this.ty * matrix.d + matrix.ty;

        this.fromArray(arr);
        return this;
    }
}