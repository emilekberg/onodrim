/**
 * TODO: This file may need to be cleaned up.
 * - Not sure if static attribs needs to be contained within lists, they can probably just be declared trhen ignored.
 * - Some magic values needs to be calculated, like offsets in add().
 */
import {Rect, Matrix3} from '../../math';
import Texture from '../../resources/texture';
import Color from '../../graphics/color';
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
    protected _staticAttrib: IAttribute[];
    protected _instanceAttrib: IAttribute[];
    // TODO: fix this.
    protected _index: {
        buffer: WebGLBuffer|null,
        data: Uint8Array
    };
    protected _bufferSize: number;
    protected _buffer: {
        buffer: WebGLBuffer | null,
        data: Float32Array
    };
    protected _count:number;
    protected _maxBufferSize: number;
    protected _batchSize: number;
    protected _maxBatchSize: number;
    protected _currentTexture:Texture;

    protected _gl:WebGL2RenderingContext;
    protected _program:WebGLProgram;

    protected _vao: WebGLVertexArrayObject;
    // look into https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
    constructor(
        gl:WebGL2RenderingContext, program:WebGLProgram,
        startBatchSize:number = 1) {
        this._gl = gl;
        this._program = program;

        this._count = 0;

        const floatsPerColor = 4;
        const floatsPerQuad = 4;
        const floatsPerMatrix = 3 * 3;
        this._batchSize = 256;
        this._maxBatchSize = 256 * 100;
        this._bufferSize = floatsPerColor + floatsPerQuad + floatsPerMatrix;
    }

    /**
     * Creates buffers and prepares a VAO for the object to be rendered.
     * TODO: This should be broken down into a instance-batch superclass instead.
     *  Basically this instance of the function should only prepare the buffers and attributes.
     *  Not setup the VAO.
     * This might be largest function in the world.
     */
    public createBuffers() {
        const gl = this._gl as WebGL2RenderingContext;
        this._index = {
            data: new Uint8Array([
                0, 1, 2,
                0, 2, 3
            ]),
            buffer: gl.createBuffer()
        };
        this._staticAttrib = [
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
        this._buffer = {
            buffer: gl.createBuffer(),
            data: new Float32Array(this._batchSize * this._bufferSize)
        };
        this._instanceAttrib = [
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._index.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._index.data, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        if (!vao) {
            console.error('could not create vertexArrayObject');
            return;
        }
        this._vao = vao;
        gl.bindVertexArray(this._vao);
        {   // used to make the scope of the vertex array a bit more clear
            this._staticAttrib.forEach((a) => {
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
            const totalStride = this._instanceAttrib.reduce((a, b) => {
                return a + b.stride;
            }, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer.buffer);
            this._instanceAttrib.forEach((a) => {
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

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._index.buffer);
        }
        gl.bindVertexArray(null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._buffer.data, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /**
     * Prepares a object to be rendered with supplied data.
     * @param matrix Render matrix for the object to be rendered.
     * @param texture Render texture for the object to be rendered.
     * @param texCoord Texture quad for the object to be rendered.
     * @param color Tinting and alpha for the object to be rendered.
     */
    public render(matrix:Matrix3, texture: Texture, texCoord:Rect,color:Color): void {
        if (!this.canRenderTexture(texture) || this._count === this._batchSize) {
            this.flush();
        }
        this._currentTexture = texture;

        const offset = this._bufferSize * this._count;
        const data = this._buffer.data;
        data[offset] = matrix.values[0];
        data[offset+1] = matrix.values[1];
        data[offset+2] = matrix.values[2];
        data[offset+3] = matrix.values[3];
        data[offset+4] = matrix.values[4];
        data[offset+5] = matrix.values[5];
        data[offset+6] = matrix.values[6];
        data[offset+7] = matrix.values[7];
        data[offset+8] = matrix.values[8];

        data[offset+9] = texCoord.array[0];
        data[offset+10] = texCoord.array[1];
        data[offset+11] = texCoord.array[2];
        data[offset+12] = texCoord.array[3];

        data[offset+13] = color.array[0];
        data[offset+14] = color.array[1];
        data[offset+15] = color.array[2];
        data[offset+16] = color.array[3];
        ++this._count;
    }

    /**
     * flushes the batched objects and renders them into the backbuffer.
     */
    public flush() {
        const gl = this._gl as WebGL2RenderingContext;
        if (this._count === 0) {
            return;
        }

        gl.bindVertexArray(this._vao);
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer.buffer);
            // gl.bufferData(gl.ARRAY_BUFFER, this.buffer.data, gl.DYNAMIC_DRAW);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._buffer.data, 0, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._currentTexture.glTexture);

            gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this._count);
        }
        this.flushDone();
    }

    /**
     * This resets values and creates a larger buffer if there is enough size.
     */
    private flushDone(): void {
        const gl = this._gl;
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        if(this._count === this._batchSize && this._count < this._maxBatchSize) {
            this.createLargerBuffer();
        }
        this._count = 0;
    }

    /**
     * Created a twice sized buffer. This is useful if the rendered buffer is not large enough
     * and there is still headroom for a new buffer.
     */
    private createLargerBuffer() {
        this._batchSize *= 2;

        const old = this._buffer.data;
        this._buffer.data = new Float32Array(this._batchSize * this._bufferSize);
        this._buffer.data.set(old);

        const gl = this._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._buffer.data, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /**
     * returns true if the texture is of the same type as the previous one.
     * @param texture 
     */
    private canRenderTexture(texture: Texture): boolean {
        return this._currentTexture === undefined || (this._currentTexture.url === texture.url);
    }
}
