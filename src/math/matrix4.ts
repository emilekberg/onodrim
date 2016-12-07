// heavily based upon https://github.com/pixijs/pixi.js/blob/master/src/core/math/Matrix.js
import Vector3 from './vector3';
export default class Matrix4 {
    public static identity:Matrix4 = new Matrix4();
    public static count:number = 16;
    public values:Float32Array;
    constructor(values?:number[]) {
        if (values) {
            this.values = new Float32Array(values);
        }
        else {
            this.values = new Float32Array([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1
            ]);
        }

    }
    public identity():Matrix4 {
        return this.copy(Matrix4.identity);
    }
    public set(m00:number, m01:number, m02:number, m03:number,
               m10:number, m11:number, m12:number, m13:number,
               m20:number, m21:number, m22:number, m23:number,
               m30:number, m31:number, m32:number, m33:number) {
        this.values[0] = m00;
        this.values[1] = m01;
        this.values[2] = m02;
        this.values[3] = m03;
        this.values[4] = m10;
        this.values[5] = m11;
        this.values[6] = m12;
        this.values[7] = m13;
        this.values[8] = m20;
        this.values[9] = m21;
        this.values[10] = m22;
        this.values[11] = m23;
        this.values[12] = m30;
        this.values[13] = m31;
        this.values[14] = m32;
        this.values[15] = m33;
        return this;
    }

    public copy(from:Matrix4) {
        this.values[0] = from.values[0];
        this.values[1] = from.values[1];
        this.values[2] = from.values[2];
        this.values[3] = from.values[3];
        this.values[4] = from.values[4];
        this.values[5] = from.values[5];
        this.values[6] = from.values[6];
        this.values[7] = from.values[7];
        this.values[8] = from.values[8];
        this.values[9] = from.values[9];
        this.values[10] = from.values[10];
        this.values[11] = from.values[11];
        this.values[12] = from.values[12];
        this.values[13] = from.values[13];
        this.values[14] = from.values[14];
        this.values[15] = from.values[15];
        return this;
    }

    public multiply(b:Matrix4):Matrix4 {
        let a00 = b.values[0];
        let a01 = b.values[1];
        let a02 = b.values[2];
        let a03 = b.values[3];
        let a10 = b.values[4];
        let a11 = b.values[5];
        let a12 = b.values[6];
        let a13 = b.values[7];
        let a20 = b.values[8];
        let a21 = b.values[9];
        let a22 = b.values[10];
        let a23 = b.values[11];
        let a30 = b.values[12];
        let a31 = b.values[13];
        let a32 = b.values[14];
        let a33 = b.values[15];

        // Cache only the current line of the second matrix
        let b0 = b.values[0];
        let b1 = b.values[1];
        let b2 = b.values[2];
        let b3 = b.values[3];
        this.values[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.values[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.values[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.values[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b.values[4];
        b1 = b.values[5];
        b2 = b.values[6];
        b3 = b.values[7];
        this.values[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.values[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.values[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.values[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b.values[8];
        b1 = b.values[9];
        b2 = b.values[10];
        b3 = b.values[11];
        this.values[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.values[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.values[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.values[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b.values[12];
        b1 = b.values[13];
        b2 = b.values[14];
        b3 = b.values[15];
        this.values[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.values[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.values[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.values[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
        return this;
    }

    public scale(x:number, y:number, z:number): Matrix4 {
        this.values[0] = this.values[0] * x;
        this.values[1] = this.values[1] * x;
        this.values[2] = this.values[2] * x;
        this.values[3] = this.values[3] * x;
        this.values[4] = this.values[4] * y;
        this.values[5] = this.values[5] * y;
        this.values[6] = this.values[6] * y;
        this.values[7] = this.values[7] * y;
        this.values[8] = this.values[8] * z;
        this.values[9] = this.values[9] * z;
        this.values[10] = this.values[10] * z;
        this.values[11] = this.values[11] * z;
        /*
        can be skipped because we are the same matrix.
        this.values[12] = this.values[12];
        this.values[13] = this.values[13];
        this.values[14] = this.values[14];
        this.values[15] = this.values[15];
        */
        return this;
    }

    public rotate(rad:number, axis:Vector3):Matrix4 {
        let x = axis.x;
        let y = axis.y;
        let z = axis.z;
        let len = axis.length();
        let s:number;
        let c:number;
        let t:number;
        let a00:number;
        let a01:number;
        let a02:number;
        let a03:number;
        let a10:number;
        let a11:number;
        let a12:number;
        let a13:number;
        let a20:number;
        let a21:number;
        let a22:number;
        let a23:number;
        let b00:number;
        let b01:number;
        let b02:number;
        let b10:number;
        let b11:number;
        let b12:number;
        let b20:number;
        let b21:number;
        let b22:number;

        if (Math.abs(len) < 0.000001) { return this; }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = this.values[0]; a01 = this.values[1]; a02 = this.values[2]; a03 = this.values[3];
        a10 = this.values[4]; a11 = this.values[5]; a12 = this.values[6]; a13 = this.values[7];
        a20 = this.values[8]; a21 = this.values[9]; a22 = this.values[10]; a23 = this.values[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        this.values[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this.values[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this.values[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this.values[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this.values[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this.values[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this.values[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this.values[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this.values[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this.values[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this.values[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this.values[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    }

    public translate(x:number, y:number, z:number):Matrix4 {
        this.values[12] = this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12];
        this.values[13] = this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13];
        this.values[14] = this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14];
        this.values[15] = this.values[3] * x + this.values[7] * y + this.values[11] * z + this.values[15];
        return this;
    }

    public equals(matrix:Matrix4) {
        return (
            this.values[0] === matrix.values[0] &&
            this.values[1] === matrix.values[1] &&
            this.values[2] === matrix.values[2] &&
            this.values[3] === matrix.values[3] &&
            this.values[4] === matrix.values[4] &&
            this.values[5] === matrix.values[5] &&
            this.values[6] === matrix.values[6] &&
            this.values[7] === matrix.values[7] &&
            this.values[8] === matrix.values[8] &&
            this.values[9] === matrix.values[9] &&
            this.values[10] === matrix.values[10] &&
            this.values[11] === matrix.values[11] &&
            this.values[12] === matrix.values[12] &&
            this.values[13] === matrix.values[13] &&
            this.values[14] === matrix.values[14] &&
            this.values[15] === matrix.values[15]
        );
    }
}
