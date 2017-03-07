// http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
// https://jsfiddle.net/omsqo7v0/6/
export interface WebGL2RenderingContext extends WebGLRenderingContext {
    vertexAttribDivisor: (index: number, divisor: number) => void;
    drawArrayInstanced: () => void;
    drawElementsInstanced: (mode: number, count: number, type: number, offset: number, instanceCount: number) => void;
    createVertexArray: () => WebGLVertexArrayObject;
    bindVertexArray: (vao: WebGLVertexArrayObject|null) => void;
}
export interface WebGLVertexArrayObject {

}
import {Rect, Matrix3} from '../../math';
import Texture from '../../resources/texture';
import Color from '../../graphics/color';
import BatchGroup from './batching/batch-group';
import TextureGroup from './batching/texture-group';
export interface IAttribute {
    data: Float32Array|Uint8Array|Int8Array;
    buffer: WebGLBuffer|null;
    index: number;
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
    divisor: number;
    length: number;
}

export interface IAttributes {
    indices: Uint8Array;
    vertices: Int8Array;
    texCoord: Uint8Array;
    aMatrix: Float32Array;
    aTexQuad: Float32Array;
    aColor: Float32Array;
}

export default class SpriteBatch {
    public static MAX_BATCH_SIZE:number = 0b1000000000000000;
    public static BATCH_INCREASE_FACTOR:number = 0b10;
    public static INDICES_PER_INSTANCE = 6;
    public static MATRIX_PER_INSTANCE = 3 * 3;
    public static VERTICES_PER_INSTANCE = 8;
    public static COLOR_PER_INSTANCE = 4;

    public attributes:IAttributes;
    public staticAttrib: {
        vertex: IAttribute,
        texCoord: IAttribute
    }
    public instanceAttrib: {
        instanceTextureQuad: IAttribute,
        instanceMatrix: IAttribute,
        instanceColor: IAttribute
    }; // TODO: Change to array when VAO is implemented.
    public index: {
        buffer: WebGLBuffer|null,
        data: Uint8Array
    };
    public count:number;
    public size:number;
    public batchSize:number;
    public lastTexture:Texture;

    protected _textureGroup:TextureGroup;

    protected _texture:Texture;
    protected _gl:WebGLRenderingContext;
    protected _program:WebGLProgram;

    protected _vao: WebGLVertexArrayObject;
    // look into https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
    constructor(
        gl:WebGLRenderingContext, program:WebGLProgram,
        startBatchSize:number = 1) {
        this._gl = gl;
        this._program = program;
        this.batchSize = startBatchSize;
        this.size = this.batchSize /* * 4 * 2*/;
        this.attributes = {
            // vertex buffer
            vertices: new Int8Array([
                -1, -1,
                -1, 1,
                1, 1,
                1, -1
            ]),
            // index buffer
            indices: new Uint8Array([
                0, 1, 2,
                0, 2, 3
            ]),
            // texcoord buffer
            texCoord: new Uint8Array([
                0, 0,
                0, 1,
                1, 1,
                1, 0
            ]),

            // matrix buffer
            aMatrix: new Float32Array(this.size * SpriteBatch.MATRIX_PER_INSTANCE),
            // Texture coordinate
            aTexQuad: new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE),
            // Color
            aColor: new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE)
        };
        this.count = 0;
        this._textureGroup = new TextureGroup();
    }

    public createLargerBuffers() {
        this.batchSize *= SpriteBatch.BATCH_INCREASE_FACTOR;
        this.size = this.batchSize;

        const oldMatrix = this.instanceAttrib.instanceMatrix.data;
        this.instanceAttrib.instanceMatrix.data = new Float32Array(this.size * SpriteBatch.MATRIX_PER_INSTANCE);
        this.instanceAttrib.instanceMatrix.data.set(oldMatrix);

        const oldColor = this.instanceAttrib.instanceColor.data;
        this.instanceAttrib.instanceColor.data = new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE);
        this.instanceAttrib.instanceColor.data.set(oldColor);

        const oldTexQuad = this.instanceAttrib.instanceTextureQuad.data;
        this.instanceAttrib.instanceTextureQuad.data = new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE);
        this.instanceAttrib.instanceTextureQuad.data.set(oldTexQuad);
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
        this.staticAttrib = {
            vertex: {
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
            texCoord: {
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
        };
        this.instanceAttrib = {
            instanceTextureQuad: {
                data: new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE),
                buffer: gl.createBuffer(),
                index: gl.getAttribLocation(this._program, 'instanceTextureQuad'),
                size: 4,
                type: gl.FLOAT,
                normalized: false,
                stride: 16,
                offset: 0,
                length: 1,
                divisor: 1
            },
            instanceMatrix: {
                data: new Float32Array(this.size * SpriteBatch.MATRIX_PER_INSTANCE),
                buffer: gl.createBuffer(),
                index: gl.getAttribLocation(this._program, 'instanceMatrix'),
                size: 3,
                type: gl.FLOAT,
                normalized: false,
                stride: 36,
                offset: 12,
                length: 3,
                divisor: 1
            },
            instanceColor: {
                data: new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE),
                buffer: gl.createBuffer(),
                index: gl.getAttribLocation(this._program, 'instanceColor'),
                size: 4,
                type: gl.FLOAT,
                normalized: false,
                stride: 16,
                offset: 0,
                length: 1,
                divisor: 1
            }
        };

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.index.data, gl.DYNAMIC_DRAW);
        

        this._vao = gl.createVertexArray();
        gl.bindVertexArray(this._vao);
        for(const k in this.staticAttrib) {
            if (!this.staticAttrib.hasOwnProperty(k)) {
                continue;
            }
            const a = this.staticAttrib[k];
            gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, a.data as Float32Array, gl.DYNAMIC_DRAW);
            gl.enableVertexAttribArray(a.index);
            gl.vertexAttribPointer(a.index, a.size, a.type, a.normalized, a.stride, a.offset);
            gl.vertexAttribDivisor(a.index, a.divisor);
        }
        for(const k in this.instanceAttrib) {
            if (!this.instanceAttrib.hasOwnProperty(k)) {
                continue;
            }
            const a = this.instanceAttrib[k];
            gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
            // gl.bufferData(gl.ARRAY_BUFFER, a.data as Float32Array, gl.DYNAMIC_DRAW);
            for(let i = 0; i < a.length; i++) {
                gl.enableVertexAttribArray(a.index + i);
            }
            for(let i = 0; i < a.length; i++) {
                gl.vertexAttribPointer(a.index + i, a.size, a.type, a.normalized, a.stride, a.offset * i);
            }
            for(let i = 0; i < a.length; i++) {
                gl.vertexAttribDivisor(a.index + i, a.divisor);
            }
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index.buffer);
        gl.bindVertexArray(null);
    }

    public canRenderTexture(texture: Texture): boolean {
        return this.lastTexture === undefined || (this.lastTexture.url === texture.url);
    }

    public add(matrix:Matrix3, texture: Texture, texCoord:Rect,color:Color):boolean {
        this.lastTexture = texture;

        this.instanceAttrib.instanceMatrix.data.set(matrix.values, this.count * SpriteBatch.MATRIX_PER_INSTANCE);
        this.instanceAttrib.instanceTextureQuad.data.set(texCoord.array, this.count * 4);
        this.instanceAttrib.instanceColor.data.set(color.array, this.count * 4);

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
        // Fill buffer with data
        // If a new texture, create a new group
        // activate group:
        //      set texture
        // Draw each group from start to end
        gl.bindVertexArray(this._vao);

        // Set data;
        for(const k in this.instanceAttrib) {
            if (!this.instanceAttrib.hasOwnProperty(k)) {
                continue;
            }
            const a = this.instanceAttrib[k];
            gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, a.data as Float32Array, gl.DYNAMIC_DRAW);
        }

        // render;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.lastTexture.glTexture);

        gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this.count);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.renderDone();
    }

    public renderDone() {
        if(this.count === this.batchSize) {
            this.createLargerBuffers();
        }
        this.count = 0;
        this._textureGroup.reset();
    }
}
