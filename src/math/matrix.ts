// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/math/Matrix.js
export default class Matrix {
    public static identity:Matrix = new Matrix();
    public static count:number = 9;
    public static makeTranslation(tx:number, ty:number):Matrix {
        return new Matrix([
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ]);
    }
    public static makeRotation(rotation:number):Matrix {
        let c = Math.cos(rotation);
        let s = Math.sin(rotation);
        return new Matrix([
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]);
    }
    public static makeScale(sx:number, sy:number):Matrix {
        return new Matrix([
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]);
    }
    public static multiply(a:Matrix, b:Matrix):Matrix {
        let a00 = a.values[0*3+0];
        let a01 = a.values[0*3+1];
        let a02 = a.values[0*3+2];
        let a10 = a.values[1*3+0];
        let a11 = a.values[1*3+1];
        let a12 = a.values[1*3+2];
        let a20 = a.values[2*3+0];
        let a21 = a.values[2*3+1];
        let a22 = a.values[2*3+2];
        let b00 = b.values[0*3+0];
        let b01 = b.values[0*3+1];
        let b02 = b.values[0*3+2];
        let b10 = b.values[1*3+0];
        let b11 = b.values[1*3+1];
        let b12 = b.values[1*3+2];
        let b20 = b.values[2*3+0];
        let b21 = b.values[2*3+1];
        let b22 = b.values[2*3+2];
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
    private static tmp:Matrix = new Matrix();

    public values:Float32Array;

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
    public identity():Matrix {
        return this.set(
            1,0,0,
            0,1,0,
            0,0,1
        );
    }
    public set(a:number,b:number,c:number,d:number,e:number,f:number,g:number,h:number,i:number) {
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

    public copy(matrix:Matrix) {
        for(let i = 0; i < Matrix.count; i++) {
            this.values[i] = matrix.values[i];
        }
        return this;
    }

    public multiply(b:Matrix):Matrix {
        const a00 = this.values[0*3+0];
        const a01 = this.values[0*3+1];
        const a02 = this.values[0*3+2];
        const a10 = this.values[1*3+0];
        const a11 = this.values[1*3+1];
        const a12 = this.values[1*3+2];
        const a20 = this.values[2*3+0];
        const a21 = this.values[2*3+1];
        const a22 = this.values[2*3+2];
        const b00 = b.values[0*3+0];
        const b01 = b.values[0*3+1];
        const b02 = b.values[0*3+2];
        const b10 = b.values[1*3+0];
        const b11 = b.values[1*3+1];
        const b12 = b.values[1*3+2];
        const b20 = b.values[2*3+0];
        const b21 = b.values[2*3+1];
        const b22 = b.values[2*3+2];
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

    public scale(x:number, y:number): Matrix {
        Matrix.tmp.set(
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        );
        return this.multiply(Matrix.tmp);
    }

    public rotate(rotation:number):Matrix {
        let s = Math.sin(rotation);
        let c = Math.cos(rotation);
        Matrix.tmp.set(
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        );
        return this.multiply(Matrix.tmp);
    }

    public translate(x:number,y:number):Matrix {
        Matrix.tmp.set(
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        );
        return this.multiply(Matrix.tmp);
    }

    public equals(matrix:Matrix) {
        let equal = true;
        for(let i = 0; i < Matrix.count; i++) {
            equal = matrix.values[i] === this.values[i];
            if (equal === false) {
                return false;
            }
        }
        return true;
    }
}
