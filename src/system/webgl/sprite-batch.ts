// http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
// https://jsfiddle.net/omsqo7v0/6/
import {Rect, Matrix3} from "../../math";
import Texture from "../../resources/texture";

export interface IAttributes {
    aVertex: Float32Array;
    aTexCoord: Float32Array;
    indices: Uint16Array;
}
export class Group {
    public start: number;
    public length: number;
    public texture: Texture;
}
export class TextureGroup {
    public readonly groups: Group[];
    private _current: number;
    public get currentIndex(): number {
        return this._current;
    }
    public get current():Group {
        return this.groups[this._current];
    }

    constructor() {
        this.groups = [];
        this._current = -1;
    }
    public reset() {
        this._current = -1;
    }

    public getGroup(texture:Texture) {
        if (this._current === -1 || this.groups[this._current].texture.url !== texture.url) {
            this._current = this.getNextIndex();
            this.groups[this._current].texture = texture;
            this.groups[this._current].length = 0;
        }
        return this.groups[this._current];
    }

    protected getNextIndex(): number {
        if (this._current === this.groups.length-1) {
            this.groups.push({texture: undefined, start: 0, length: 0});
            return ++this._current;
        }
        return ++this._current;
    }
}
export default class SpriteBatch {
    public static VERTEX_BUFFER: WebGLBuffer;
    public static VERTEX_ATTRIB:number;
    public static INDEX_BUFFER: WebGLBuffer;
    public static TEXCOORD_BUFFER:WebGLBuffer;
    public static TEXCOORD_ATTRIB:number;
    public static POSITION_BUFFER:WebGLBuffer;
    public static POSITION_ATTRIB:number;

    public static MAX_BATCH_SIZE:number = 0b1000000000000000;
    public static BATCH_INCREASE_FACTOR:number = 0b10;
    public static INDICES_PER_INSTANCE = 6;
    public static VERTICES_PER_INSTANCE = 8;

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
        this.size = this.batchSize * 4 * 2;
        this.attributes = {
             // Index
             indices: new Uint16Array(this.size * SpriteBatch.INDICES_PER_INSTANCE),
             // Texture coordinate
             aTexCoord: new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE),
             // Position
             aVertex: new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE),
        };
        this.count = 0;
        this._textureGroup = new TextureGroup();
    }

    public createLargerBuffers() {
        this.batchSize *= SpriteBatch.BATCH_INCREASE_FACTOR;
        this.size = this.batchSize * 4 * 2;
        const oldIndices = this.attributes.indices;
        this.attributes.indices = new Uint16Array(this.size * SpriteBatch.INDICES_PER_INSTANCE);
        this.attributes.indices.set(oldIndices);

        const oldTexcoord = this.attributes.aTexCoord;
        this.attributes.aTexCoord = new Float32Array(this.size * SpriteBatch.VERTICES_PER_INSTANCE);
        this.attributes.aTexCoord.set(oldTexcoord);

        const oldVertices = this.attributes.aVertex;
        this.attributes.aVertex = new Float32Array(this.size * SpriteBatch.INDICES_PER_INSTANCE);
        this.attributes.aVertex.set(oldVertices);
    }


    public createBuffers() {
        const gl = this._gl;
        // Vertex Buffer
        SpriteBatch.VERTEX_ATTRIB = gl.getAttribLocation(this._program, "a_vertex");
        SpriteBatch.VERTEX_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER);
        gl.enableVertexAttribArray(SpriteBatch.VERTEX_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.VERTEX_ATTRIB, 2, gl.FLOAT, false, 0, 0);

        // Index Buffer
        SpriteBatch.INDEX_BUFFER = gl.createBuffer();

        // Texture coordinate buffer
        SpriteBatch.TEXCOORD_ATTRIB = gl.getAttribLocation(this._program, "a_texCoord");
        SpriteBatch.TEXCOORD_BUFFER = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        gl.enableVertexAttribArray(SpriteBatch.TEXCOORD_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.TEXCOORD_ATTRIB, 2, gl.FLOAT, false, 0, 0);
    }

    public add(matrix:Matrix3, texture: Texture, texCoord:Rect, texCoordPixel:Rect):boolean {
        const prevGroup = this._textureGroup.current;
        const group = this._textureGroup.getGroup(texture);
        if(group !== prevGroup) {
            group.start = this.count;
        }
        // http://stackoverflow.com/questions/38853096/webgl-how-to-bind-values-to-a-mat4-attribute
        const vertexOffset = this.count * 8;

        matrix.setVertexData(this.attributes.aVertex, vertexOffset, texCoordPixel);

        this.attributes.aTexCoord[vertexOffset+0] = texCoord.x; // 0.0;
        this.attributes.aTexCoord[vertexOffset+1] = texCoord.y; // 0.0;

        this.attributes.aTexCoord[vertexOffset+2] = texCoord.x + texCoord.w; // 1.0;
        this.attributes.aTexCoord[vertexOffset+3] = texCoord.y; // 0.0;

        this.attributes.aTexCoord[vertexOffset+4] = texCoord.x + texCoord.w;// 1.0;
        this.attributes.aTexCoord[vertexOffset+5] = texCoord.y + texCoord.h;// 1.0;

        this.attributes.aTexCoord[vertexOffset+6] = texCoord.x; // 0.0;
        this.attributes.aTexCoord[vertexOffset+7] = texCoord.y + texCoord.h;// 1.0;*/

        const indexPosOffset = this.count * 6;
        const indexValueOffset = this.count * 4;
        this.attributes.indices[indexPosOffset + 0] = indexValueOffset + 0;
        this.attributes.indices[indexPosOffset + 1] = indexValueOffset + 1;
        this.attributes.indices[indexPosOffset + 2] = indexValueOffset + 2;
        this.attributes.indices[indexPosOffset + 3] = indexValueOffset + 0;
        this.attributes.indices[indexPosOffset + 4] = indexValueOffset + 2;
        this.attributes.indices[indexPosOffset + 5] = indexValueOffset + 3;

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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SpriteBatch.INDEX_BUFFER);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.attributes.indices, gl.STATIC_DRAW);

        let l = this._textureGroup.currentIndex+1;
        for(let i = 0; i < l; i++) {
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
