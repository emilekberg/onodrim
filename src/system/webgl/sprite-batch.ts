// http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
// https://jsfiddle.net/omsqo7v0/6/
import {Rect, Matrix3} from '../../math';
import Texture from '../../resources/texture';
import Color from '../../graphics/color';
import BatchGroup from './batching/batch-group';
export interface IAttribute {
    data?: Float32Array|Uint8Array|Int8Array;
    buffer?: WebGLBuffer|null;
    index: number;
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
    divisor: number;
    length: number;
}

export default class SpriteBatch {
    public static MAX_BATCH_SIZE:number = 0b1000000000000000;
    public static BATCH_INCREASE_FACTOR:number = 0b10;

    public staticAttrib: IAttribute[];
    public instanceAttrib: IAttribute[];
    // TODO: fix this.
    public index: {
        buffer: WebGLBuffer|null,
        data: Uint8Array
    };
    public bufferSize: number;
    public buffer: {
        buffer: WebGLBuffer | null,
        data: Float32Array
    };
    public count:number;
    public size:number;
    public batchSize:number;
    public lastTexture:Texture;

    protected _texture:Texture;
    protected _gl:WebGL2RenderingContext;
    protected _program:WebGLProgram;

    protected _vao: WebGLVertexArrayObject;
    // look into https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
    constructor(
        gl:WebGL2RenderingContext, program:WebGLProgram,
        startBatchSize:number = 1) {
        this._gl = gl;
        this._program = program;
        this.batchSize = startBatchSize;
        this.size = this.batchSize;
        this.count = 0;

        const floatsPerColor = 4;
        const floatsPerQuad = 4;
        const floatsPerMatrix = 3 * 3;
        this.bufferSize = floatsPerColor + floatsPerQuad + floatsPerMatrix;
    }

    public createLargerBuffer() {
        this.batchSize *= SpriteBatch.BATCH_INCREASE_FACTOR;
        this.size = this.batchSize;

        const old = this.buffer.data;
        this.buffer.data = new Float32Array(this.size * this.bufferSize);
        this.buffer.data.set(old);

        const gl = this._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.buffer.data, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public createBuffers() {
        const gl = this._gl as WebGL2RenderingContext;
        this.index = {
            data: new Uint8Array([
                0, 1, 2,
                0, 2, 3
            ]),
            buffer: gl.createBuffer()
        };
        this.staticAttrib = [
            {
                data: new Int8Array([
                    -1, -1,
                    -1, 1,
                    1, 1,
                    1, -1
                ]),
                buffer: gl.createBuffer(),
                index: gl.getAttribLocation(this._program, 'vertex'),
                size: 2,
                type: gl.BYTE,
                normalized: false,
                stride: 0,
                offset: 0,
                length: 1,
                divisor: 0
            },
            {
                data: new Uint8Array([
                    0, 0,
                    0, 1,
                    1, 1,
                    1, 0
                ]),
                buffer: gl.createBuffer(),
                index: gl.getAttribLocation(this._program, 'texCoord'),
                size: 2,
                type: gl.UNSIGNED_BYTE,
                normalized: false,
                stride: 0,
                offset: 0,
                length: 1,
                divisor: 0
            }
        ];
        this.buffer = {
            buffer: gl.createBuffer(),
            data: new Float32Array(this.size * this.bufferSize)
        };
        this.instanceAttrib = [
            {
                index: gl.getAttribLocation(this._program, 'instanceMatrix'),
                size: 3,
                type: gl.FLOAT,
                normalized: false,
                stride: 36,
                offset: 12,
                length: 3,
                divisor: 1
            },
            {
                index: gl.getAttribLocation(this._program, 'instanceTextureQuad'),
                size: 4,
                type: gl.FLOAT,
                normalized: false,
                stride: 16,
                offset: 16,
                length: 1,
                divisor: 1
            },
            {
                index: gl.getAttribLocation(this._program, 'instanceColor'),
                size: 4,
                type: gl.FLOAT,
                normalized: false,
                stride: 16,
                offset: 16,
                length: 1,
                divisor: 1
            }
        ];

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.index.data, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        if (!vao) {
            console.error('could not create vertexArrayObject');
            return;
        }
        this._vao = vao;
        gl.bindVertexArray(this._vao);
        {   // used to make the scope of the vertex array a bit more clear
            this.staticAttrib.forEach((a) => {
                if (!a.buffer) {
                    return;
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, a.data as Float32Array, gl.STATIC_DRAW);

                gl.enableVertexAttribArray(a.index);
                gl.vertexAttribPointer(a.index, a.size, a.type, a.normalized, a.stride, a.offset);
                gl.vertexAttribDivisor(a.index, a.divisor);
            });

            // Store the offset between each packed vertex attribute
            let offset = 0;
            // Calculate and store the total stride for the instance data.
            const totalStride = this.instanceAttrib.reduce((a, b) => {
                return a + b.stride;
            }, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
            this.instanceAttrib.forEach((a) => {
                for(let i = 0; i < a.length; i++) {
                    gl.enableVertexAttribArray(a.index + i);
                }
                for(let i = 0; i < a.length; i++) {
                    const currentOffset = offset + (a.offset * i);
                    gl.vertexAttribPointer(a.index + i, a.size, a.type, a.normalized, totalStride, currentOffset);
                }
                for(let i = 0; i < a.length; i++) {
                    gl.vertexAttribDivisor(a.index + i, a.divisor);
                }
                offset += a.stride;
            });

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index.buffer);
        }
        gl.bindVertexArray(null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.buffer.data, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public canRenderTexture(texture: Texture): boolean {
        return this.lastTexture === undefined || (this.lastTexture.url === texture.url);
    }

    public add(matrix:Matrix3, texture: Texture, texCoord:Rect,color:Color):boolean {
        this.lastTexture = texture;

        const offset = this.bufferSize * this.count;
        this.buffer.data.set(matrix.values, offset);
        this.buffer.data.set(texCoord.array, offset + 9);
        this.buffer.data.set(color.array, offset + 13);
        return ++this.count !== this.batchSize;
    }

    public setTexture(texture:Texture) {
        this._texture = texture;
    }

    public render() {
        const gl = this._gl as WebGL2RenderingContext;
        if (this.count === 0) {
            return;
        }

        gl.bindVertexArray(this._vao);
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
            // gl.bufferData(gl.ARRAY_BUFFER, this.buffer.data, gl.DYNAMIC_DRAW);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.data, 0, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.lastTexture.glTexture);

            gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this.count);
        }
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.renderDone();
    }

    public renderDone() {
        if(this.count === this.batchSize) {
            this.createLargerBuffer();
        }
        this.count = 0;
    }
}
