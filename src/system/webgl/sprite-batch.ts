// http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
// https://jsfiddle.net/omsqo7v0/6/
export interface WebGL2RenderingContext extends WebGLRenderingContext {
    vertexAttribDivisor: (index: number, divisor: number) => void;
    drawArrayInstanced: () => void;
    drawElementsInstanced: (mode: number, count: number, type: number, offset: number, instanceCount: number) => void;
}
import {Rect, Matrix3} from '../../math';
import Texture from '../../resources/texture';
import Color from '../../graphics/color';
import BatchGroup from './batching/batch-group';
import TextureGroup from './batching/texture-group';
export interface IAttributes {
    indices: Uint16Array;
    aVertex: Float32Array;
    aMatrix: Float32Array;
    aTexCoord: Float32Array;
    aColor: Float32Array;
}

export default class SpriteBatch {
    public static VERTEX_BUFFER: WebGLBuffer|null;
    public static VERTEX_ATTRIB:number;
    public static INDEX_BUFFER: WebGLBuffer|null;
    public static MATRIX_BUFFER: WebGLBuffer|null;
    public static MATRIX_ATTRIB:number;
    public static TEXCOORD_BUFFER:WebGLBuffer|null;
    public static TEXCOORD_ATTRIB:number;
    public static POSITION_BUFFER:WebGLBuffer|null;
    public static POSITION_ATTRIB:number;
    public static COLOR_BUFFER:WebGLBuffer|null;
    public static COLOR_ATTRIB:number;

    public static MAX_BATCH_SIZE:number = 0b1000000000000000;
    public static BATCH_INCREASE_FACTOR:number = 0b10;
    public static INDICES_PER_INSTANCE = 6;
    public static MATRIX_PER_INSTANCE = 3 * 3;
    public static VERTICES_PER_INSTANCE = 8;
    public static COLOR_PER_INSTANCE = 4 * 4;

    public attributes:IAttributes;
    public count:number;
    public size:number;
    public batchSize:number;

    protected _textureGroup:TextureGroup;

    protected _texture:Texture;
    protected _gl:WebGLRenderingContext;
    protected _program:WebGLProgram;
    constructor(
        gl:WebGLRenderingContext, program:WebGLProgram,
        startBatchSize:number = 1) {
        this._gl = gl;
        this._program = program;

        this.batchSize = startBatchSize;
        this.size = this.batchSize /* * 4 * 2*/;
        this.attributes = {
            // vertex buffer
            aVertex: new Float32Array([
                -1, -1,
                -1, 1,
                1, 1,
                1, -1
            ]),
            // index buffer
            indices: new Uint16Array([
                0, 1, 2,
                0, 2, 3
            ]),
            // matrix buffer
            aMatrix: new Float32Array(this.size * SpriteBatch.MATRIX_PER_INSTANCE),
            // Texture coordinate
            aTexCoord: new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE),
            // Color
            aColor: new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE)
        };
        this.count = 0;
        this._textureGroup = new TextureGroup();
    }

    public createLargerBuffers() {
        this.batchSize *= SpriteBatch.BATCH_INCREASE_FACTOR;
        this.size = this.batchSize;

        const oldMatrix = this.attributes.aMatrix;
        this.attributes.aMatrix = new Float32Array(this.size * SpriteBatch.MATRIX_PER_INSTANCE);
        this.attributes.aMatrix.set(oldMatrix);

        const oldTexcoord = this.attributes.aTexCoord;
        this.attributes.aTexCoord = new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE);
        this.attributes.aTexCoord.set(oldTexcoord);

        const oldColor = this.attributes.aColor;
        this.attributes.aColor = new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE);
        this.attributes.aColor.set(oldColor);
    }

    public createBuffers() {
        const gl = this._gl as WebGL2RenderingContext;
        // Vertex Buffer
        SpriteBatch.VERTEX_ATTRIB = gl.getAttribLocation(this._program, 'a_vertex');
        SpriteBatch.VERTEX_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aVertex, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(SpriteBatch.VERTEX_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.VERTEX_ATTRIB, 2, gl.FLOAT, false, 0, 0);

        // Index Buffer
        SpriteBatch.INDEX_BUFFER = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SpriteBatch.INDEX_BUFFER);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.attributes.indices, gl.STATIC_DRAW);

        // Matrix Buffer
        SpriteBatch.MATRIX_ATTRIB = gl.getAttribLocation(this._program, 'a_matrix');
        SpriteBatch.MATRIX_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.MATRIX_BUFFER);
        //gl.enableVertexAttribArray(SpriteBatch.MATRIX_ATTRIB);
        //gl.enableVertexAttribArray(SpriteBatch.MATRIX_ATTRIB+1);
        //gl.enableVertexAttribArray(SpriteBatch.MATRIX_ATTRIB+2);

        gl.vertexAttribPointer(SpriteBatch.MATRIX_ATTRIB,   3, gl.FLOAT, false, 36, 0);
        gl.vertexAttribPointer(SpriteBatch.MATRIX_ATTRIB+1, 3, gl.FLOAT, false, 36, 12);
        gl.vertexAttribPointer(SpriteBatch.MATRIX_ATTRIB+2, 3, gl.FLOAT, false, 36, 24);

        gl.vertexAttribDivisor(SpriteBatch.MATRIX_ATTRIB,   1);
        gl.vertexAttribDivisor(SpriteBatch.MATRIX_ATTRIB+1, 1);
        gl.vertexAttribDivisor(SpriteBatch.MATRIX_ATTRIB+2, 1);

        // Texture coordinate buffer
        SpriteBatch.TEXCOORD_ATTRIB = gl.getAttribLocation(this._program, 'a_texCoord');
        SpriteBatch.TEXCOORD_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        //gl.enableVertexAttribArray(SpriteBatch.TEXCOORD_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.TEXCOORD_ATTRIB, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(SpriteBatch.TEXCOORD_ATTRIB, 1);

        // Color Buffer
        SpriteBatch.COLOR_ATTRIB = gl.getAttribLocation(this._program, 'a_color');
        SpriteBatch.COLOR_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.COLOR_BUFFER);
        gl.vertexAttribPointer(SpriteBatch.COLOR_ATTRIB, 4, gl.FLOAT, true, 16, 0);
        gl.vertexAttribDivisor(SpriteBatch.COLOR_ATTRIB, 1);
    }

    public add(matrix:Matrix3, texture: Texture, texCoord:Rect,color:Color):boolean {
        const prevGroup = this._textureGroup.current;
        const group = this._textureGroup.getGroup(texture);
        if(group !== prevGroup) {
            group.start = this.count;
        }
        // http://stackoverflow.com/questions/38853096/webgl-how-to-bind-values-to-a-mat4-attribute
        const vertexOffset = this.count * 8;

        const matrixOffset = this.count * SpriteBatch.MATRIX_PER_INSTANCE;
        this.attributes.aMatrix[matrixOffset + 0] = matrix.values[0];
        this.attributes.aMatrix[matrixOffset + 1] = matrix.values[1];
        this.attributes.aMatrix[matrixOffset + 2] = matrix.values[2];
        this.attributes.aMatrix[matrixOffset + 3] = matrix.values[3];
        this.attributes.aMatrix[matrixOffset + 4] = matrix.values[4];
        this.attributes.aMatrix[matrixOffset + 5] = matrix.values[5];
        this.attributes.aMatrix[matrixOffset + 6] = matrix.values[6];
        this.attributes.aMatrix[matrixOffset + 7] = matrix.values[7];
        this.attributes.aMatrix[matrixOffset + 8] = matrix.values[8];

        const x = texCoord.x;
        const y = texCoord.y;
        const w = texCoord.x + texCoord.w;
        const h = texCoord.y + texCoord.h;

        /*-1, -1,
        -1, 1,
        1, 1,
        1, -1
*/
        this.attributes.aTexCoord[vertexOffset+0] = x;          // 0.0;
        this.attributes.aTexCoord[vertexOffset+1] = y;          // 0.0;

        this.attributes.aTexCoord[vertexOffset+2] = x;          // 0.0;
        this.attributes.aTexCoord[vertexOffset+3] = h;          // 1.0;

        this.attributes.aTexCoord[vertexOffset+4] = w;          // 1.0;
        this.attributes.aTexCoord[vertexOffset+5] = h;          // 1.0;

        this.attributes.aTexCoord[vertexOffset+6] = w;          // 1.0;
        this.attributes.aTexCoord[vertexOffset+7] = y;          // 0.0;

        // color offset
        const i = this.count * 4 * 4;
        const aColor = this.attributes.aColor;
        aColor[i + 0] = aColor[i + 4] = aColor[i + 8] = aColor[i + 12] = color.r;
        aColor[i + 1] = aColor[i + 5] = aColor[i + 9] = aColor[i + 13] = color.g;
        aColor[i + 2] = aColor[i + 6] = aColor[i + 10] = aColor[i + 14] = color.b;
        aColor[i + 3] = aColor[i + 7] = aColor[i + 11] = aColor[i + 15] = color.a;

        aColor[i + 0] = 0;
        ++group.length;
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


        // TODO: use glBufferSubData
        gl.enableVertexAttribArray(SpriteBatch.MATRIX_ATTRIB);
        gl.enableVertexAttribArray(SpriteBatch.MATRIX_ATTRIB+1);
        gl.enableVertexAttribArray(SpriteBatch.MATRIX_ATTRIB+2);
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.MATRIX_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aMatrix, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(SpriteBatch.TEXCOORD_ATTRIB);
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aTexCoord, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(SpriteBatch.COLOR_ATTRIB);
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.COLOR_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aColor, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SpriteBatch.INDEX_BUFFER);

        const l = this._textureGroup.currentIndex+1;
        for(let i = 0; i < l; ++i) {
            const group = this._textureGroup.groups[i];
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, group.texture.glTexture);

            // gl.drawElements(gl.TRIANGLES, group.length * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
            gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, 1);
        }

        this.renderDone();
    }

    public renderDone() {
        if(this.count === this.batchSize) {
            // this.createLargerBuffers();
        }
        this.count = 0;
        this._textureGroup.reset();
    }
}
