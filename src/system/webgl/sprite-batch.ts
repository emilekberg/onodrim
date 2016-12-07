// http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
// https://jsfiddle.net/omsqo7v0/6/
import {Rect, Matrix3} from '../../math';
import Texture from '../../resources/texture';
import Color from '../../graphics/color';
import BatchGroup from './batching/batch-group';
import TextureGroup from './batching/texture-group';
export interface IAttributes {
    indices: Uint16Array;
    aVertex: Float32Array;
    aTexCoord: Float32Array;
    aColor: Float32Array;
}

export default class SpriteBatch {
    public static VERTEX_BUFFER: WebGLBuffer;
    public static VERTEX_ATTRIB:number;
    public static INDEX_BUFFER: WebGLBuffer;
    public static TEXCOORD_BUFFER:WebGLBuffer;
    public static TEXCOORD_ATTRIB:number;
    public static POSITION_BUFFER:WebGLBuffer;
    public static POSITION_ATTRIB:number;
    public static COLOR_BUFFER:WebGLBuffer;
    public static COLOR_ATTRIB:number;

    public static MAX_BATCH_SIZE:number = 0b1000000000000000;
    public static BATCH_INCREASE_FACTOR:number = 0b10;
    public static INDICES_PER_INSTANCE = 6;
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
        startBatchSize:number = 16, vertsPerQuad:number = 4,
        floatsPerVert:number = 2) {
        this._gl = gl;
        this._program = program;

        this.batchSize = startBatchSize;
        this.size = this.batchSize /* * 4 * 2*/;
        this.attributes = {
             // Index
             indices: new Uint16Array(this.size * SpriteBatch.INDICES_PER_INSTANCE),
             // Texture coordinate
             aTexCoord: new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE),
             // Position
             aVertex: new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE),
             // Color
             aColor: new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE)
        };
        this.count = 0;
        this._textureGroup = new TextureGroup();
    }

    public createLargerBuffers() {
        this.batchSize *= SpriteBatch.BATCH_INCREASE_FACTOR;
        this.size = this.batchSize/* * 4 * 2*/;
        const oldIndices = this.attributes.indices;
        this.attributes.indices = new Uint16Array(this.size * SpriteBatch.INDICES_PER_INSTANCE);
        this.attributes.indices.set(oldIndices);

        const oldTexcoord = this.attributes.aTexCoord;
        this.attributes.aTexCoord = new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE);
        this.attributes.aTexCoord.set(oldTexcoord);

        const oldVertices = this.attributes.aVertex;
        this.attributes.aVertex = new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE);
        this.attributes.aVertex.set(oldVertices);

        const oldColor = this.attributes.aColor;
        this.attributes.aColor = new Float32Array(this.size * SpriteBatch.COLOR_PER_INSTANCE);
        this.attributes.aColor.set(oldColor);
    }

    public createBuffers() {
        const gl = this._gl;
        // Index Buffer
        SpriteBatch.INDEX_BUFFER = gl.createBuffer();

        // Vertex Buffer
        SpriteBatch.VERTEX_ATTRIB = gl.getAttribLocation(this._program, 'a_vertex');
        SpriteBatch.VERTEX_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER);
        gl.enableVertexAttribArray(SpriteBatch.VERTEX_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.VERTEX_ATTRIB, 2, gl.FLOAT, false, 0, 0);

        // Texture coordinate buffer
        SpriteBatch.TEXCOORD_ATTRIB = gl.getAttribLocation(this._program, 'a_texCoord');
        SpriteBatch.TEXCOORD_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        gl.enableVertexAttribArray(SpriteBatch.TEXCOORD_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.TEXCOORD_ATTRIB, 2, gl.FLOAT, false, 0, 0);

        // Color Buffer
        SpriteBatch.COLOR_ATTRIB = gl.getAttribLocation(this._program, 'a_color');
        SpriteBatch.COLOR_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.COLOR_BUFFER);
        gl.enableVertexAttribArray(SpriteBatch.COLOR_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.COLOR_ATTRIB, 4, gl.FLOAT, false, 0, 0);
    }

    public add(matrix:Matrix3, texture: Texture, texCoord:Rect, texCoordPixel:Rect, color:Color):boolean {
        const prevGroup = this._textureGroup.current;
        const group = this._textureGroup.getGroup(texture);
        if(group !== prevGroup) {
            group.start = this.count;
        }
        // http://stackoverflow.com/questions/38853096/webgl-how-to-bind-values-to-a-mat4-attribute
        const vertexOffset = this.count * 8;

        matrix.setVertexData(this.attributes.aVertex, vertexOffset, texCoordPixel);
        const w = texCoord.x + texCoord.w;
        const h = texCoord.y + texCoord.h;
        this.attributes.aTexCoord[vertexOffset+0] = texCoord.x; // 0.0;
        this.attributes.aTexCoord[vertexOffset+1] = texCoord.y; // 0.0;

        this.attributes.aTexCoord[vertexOffset+2] = w; // 1.0;
        this.attributes.aTexCoord[vertexOffset+3] = texCoord.y; // 0.0;

        this.attributes.aTexCoord[vertexOffset+4] = w;// 1.0;
        this.attributes.aTexCoord[vertexOffset+5] = h;// 1.0;

        this.attributes.aTexCoord[vertexOffset+6] = texCoord.x; // 0.0;
        this.attributes.aTexCoord[vertexOffset+7] = h;// 1.0;*/

        const indexPosOffset = this.count * 6;
        const indexValueOffset = this.count * 4;
        this.attributes.indices[indexPosOffset + 0] = indexValueOffset + 0;
        this.attributes.indices[indexPosOffset + 1] = indexValueOffset + 1;
        this.attributes.indices[indexPosOffset + 2] = indexValueOffset + 2;
        this.attributes.indices[indexPosOffset + 3] = indexValueOffset + 0;
        this.attributes.indices[indexPosOffset + 4] = indexValueOffset + 2;
        this.attributes.indices[indexPosOffset + 5] = indexValueOffset + 3;

        // color offset
        const i = this.count * 4 * 4;
        const aColor = this.attributes.aColor;
        aColor[i + 0] = aColor[i + 4] = aColor[i + 8] = aColor[i + 12] = color.r;
        aColor[i + 1] = aColor[i + 5] = aColor[i + 9] = aColor[i + 13] = color.g;
        aColor[i + 2] = aColor[i + 6] = aColor[i + 10] = aColor[i + 14] = color.b;
        aColor[i + 3] = aColor[i + 7] = aColor[i + 11] = aColor[i + 15] = color.a;

        ++group.length;
        return ++this.count !== this.batchSize;
    }

    public setTexture(texture:Texture) {
        this._texture = texture;
    }

    public render(gl:WebGLRenderingContext) {
        if (this.count === 0) {
            return;
        }
        // Fill buffer with data
        // If a new texture, create a new group
        // activate group:
        //      set texture
        // Draw each group from start to end

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aVertex, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aTexCoord, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.COLOR_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aColor, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SpriteBatch.INDEX_BUFFER);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.attributes.indices, gl.STATIC_DRAW);

        let l = this._textureGroup.currentIndex+1;
        for(let i = 0; i < l; ++i) {
            const group = this._textureGroup.groups[i];
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, group.texture.glTexture);

            gl.drawElements(gl.TRIANGLES, group.length * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
        }

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
