//heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/math/Matrix.js
export default class Matrix {
    static Identity:Matrix = new Matrix();
    private static tmp:Matrix = new Matrix();
    values:Float32Array;
    
    get a():number {return this.values[0];}
    set a(value:number) {this.values[0] = value;}
    get b():number {return this.values[1];}
    set b(value:number) {this.values[1] = value;}
    get c():number {return this.values[3];}
    set c(value:number) {this.values[3] = value;}
    get d():number {return this.values[4];}
    set d(value:number) {this.values[4] = value;}
    get tx():number {return this.values[6];}
    set tx(value:number) {this.values[6] = value;}
    get ty():number {return this.values[7];}
    set ty(value:number) {this.values[7] = value;}
    constructor(values?:Array<number>) {
        if (values) {
            this.values = new Float32Array(values);
        }
        else {
            this.values = new Float32Array([
                1,0,0,
                0,1,0,
                0,0,1
            ]);
        }
        
    }
    identity():Matrix {
        return this.set(
            1,0,0,
            0,1,0,
            0,0,1
        );
    }
    set(a:number,b:number,c:number,d:number,e:number,f:number,g:number,h:number,i:number) {
        this.values[0] = a;
        this.values[1] = b;
        this.values[2] = c;
        this.values[3] = d;
        this.values[4] = e;
        this.values[5] = f;
        this.values[6] = g;
        this.values[7] = h;
        this.values[8] = i;
        return this;
    }

    copy(matrix:Matrix) {
        for(let i = 0; i < matrix.values.length; i++) {
            this.values[i] = matrix.values[i];
        }
        return this;
    } 

    multiply(b):Matrix {
        var a00 = this.values[0*3+0];
        var a01 = this.values[0*3+1];
        var a02 = this.values[0*3+2];
        var a10 = this.values[1*3+0];
        var a11 = this.values[1*3+1];
        var a12 = this.values[1*3+2];
        var a20 = this.values[2*3+0];
        var a21 = this.values[2*3+1];
        var a22 = this.values[2*3+2];
        var b00 = b.values[0*3+0];
        var b01 = b.values[0*3+1];
        var b02 = b.values[0*3+2];
        var b10 = b.values[1*3+0];
        var b11 = b.values[1*3+1];
        var b12 = b.values[1*3+2];
        var b20 = b.values[2*3+0];
        var b21 = b.values[2*3+1];
        var b22 = b.values[2*3+2];
        this.set(
            a00 * b00 + a01 * b10 + a02 * b20,
            a00 * b01 + a01 * b11 + a02 * b21,
            a00 * b02 + a01 * b12 + a02 * b22,
            a10 * b00 + a11 * b10 + a12 * b20,
            a10 * b01 + a11 * b11 + a12 * b21,
            a10 * b02 + a11 * b12 + a12 * b22,
            a20 * b00 + a21 * b10 + a22 * b20,
            a20 * b01 + a21 * b11 + a22 * b21,
            a20 * b02 + a21 * b12 + a22 * b22
        );
        return this;
    }

    scale(x:number, y:number):Matrix {
        Matrix.tmp.set(
            x, 0, 0, 
            0, y, 0,
            0, 0, 1
        );
        return this.multiply(Matrix.tmp);
    }

    rotate(rotation:number):Matrix {
        let s = Math.sin(rotation);
        let c = Math.cos(rotation);
        Matrix.tmp.set(
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        );
        return this.multiply(Matrix.tmp);;
    }

    translate(x:number,y:number):Matrix {
        Matrix.tmp.set(
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        );
        return this.multiply(Matrix.tmp);
    }

    static makeTranslation(tx:number, ty:number):Matrix {
        return new Matrix([
            1, 0, 0, 
            0, 1, 0,
            tx, ty, 1
        ]);
    }
    static makeRotation(rotation:number):Matrix {
        let c = Math.cos(rotation);
        let s = Math.sin(rotation);
        return new Matrix([
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]);
    }
    static makeScale(sx:number, sy:number):Matrix {
        return new Matrix([
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]);
    }
    static multiply(a:Matrix, b:Matrix):Matrix {
        var a00 = a.values[0*3+0];
        var a01 = a.values[0*3+1];
        var a02 = a.values[0*3+2];
        var a10 = a.values[1*3+0];
        var a11 = a.values[1*3+1];
        var a12 = a.values[1*3+2];
        var a20 = a.values[2*3+0];
        var a21 = a.values[2*3+1];
        var a22 = a.values[2*3+2];
        var b00 = b.values[0*3+0];
        var b01 = b.values[0*3+1];
        var b02 = b.values[0*3+2];
        var b10 = b.values[1*3+0];
        var b11 = b.values[1*3+1];
        var b12 = b.values[1*3+2];
        var b20 = b.values[2*3+0];
        var b21 = b.values[2*3+1];
        var b22 = b.values[2*3+2];
        return new Matrix([
            a00 * b00 + a01 * b10 + a02 * b20,
            a00 * b01 + a01 * b11 + a02 * b21,
            a00 * b02 + a01 * b12 + a02 * b22,
            a10 * b00 + a11 * b10 + a12 * b20,
            a10 * b01 + a11 * b11 + a12 * b21,
            a10 * b02 + a11 * b12 + a12 * b22,
            a20 * b00 + a21 * b10 + a22 * b20,
            a20 * b01 + a21 * b11 + a22 * b21,
            a20 * b02 + a21 * b12 + a22 * b22
        ]);
    }
}