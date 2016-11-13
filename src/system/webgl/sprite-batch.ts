// http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
// https://jsfiddle.net/omsqo7v0/6/
import {Rect, Matrix3} from "../../math";
import Texture from "../../resources/texture";

export interface IAttributes {
    aVertex: Float32Array;
    aTexCoord: Float32Array;
    indices: Uint16Array;
}
export default class SpriteBatch {
    public static VERTEX_BUFFER: WebGLBuffer;
    public static VERTEX_ATTRIB:number;
    public static INDEX_BUFFER: WebGLBuffer;
    public static TEXCOORD_BUFFER:WebGLBuffer;
    public static TEXCOORD_ATTRIB:number;
    public static POSITION_BUFFER:WebGLBuffer;
    public static POSITION_ATTRIB:number;
    public static SIZE_BUFFER:WebGLBuffer;
    public static SIZE_ATTRIB:number;
    public static MATRIX_BUFFER:WebGLBuffer;
    public static MATRIX_ATTRIB:number;

    public attributes:IAttributes;
    public count:number;
    public size:number;

    protected _maxQuadsPerBatch:number;
    protected _vertsPerQuad:number;
    protected _floatsPerVert:number;

    protected _texture:Texture;
    protected _gl:WebGLRenderingContext;
    protected _program:WebGLProgram;
    constructor(
        gl:WebGLRenderingContext, program:WebGLProgram,
        maxQuadsPerBatch:number = 500, vertsPerQuad:number = 4,
        floatsPerVert:number = 2) {
        this._gl = gl;
        this._program = program;
        this._maxQuadsPerBatch = maxQuadsPerBatch;
        this._vertsPerQuad = vertsPerQuad;
        this._floatsPerVert = floatsPerVert;

        this.size = this._maxQuadsPerBatch * this._vertsPerQuad * this._floatsPerVert;
        this.attributes = {
             // Index
             indices: new Uint16Array(this.size * 6),
             // Texture coordinate
             aTexCoord: new Float32Array(this.size * 8),
             // Position
             aVertex: new Float32Array(this.size * 8),
        };
        this.count = 0;
    }

    public createBuffers() {
        const gl = this._gl;
        // Vertex Buffer
        SpriteBatch.VERTEX_ATTRIB = gl.getAttribLocation(this._program, "a_vertex");
        SpriteBatch.VERTEX_BUFFER = gl.createBuffer();

        // Index Buffer
        SpriteBatch.INDEX_BUFFER = gl.createBuffer();

        // Texture coordinate buffer
        SpriteBatch.TEXCOORD_ATTRIB = gl.getAttribLocation(this._program, "a_texCoord");
        SpriteBatch.TEXCOORD_BUFFER = gl.createBuffer();
    }

    public fillDefaultBuffers() {
        /*
        const gl = this._gl;
        // Vertex Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER );
        const vertCoords = [
            // 0.0,  1.0,
            // 0.0,  0.0,
            // 1.0,  0.0,
            // 1.0,  1.0,
            -1, -1, // bottom left corner
            -1,  1, // top left corner
            1,  1, // top right corner
            1, -1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertCoords), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(SpriteBatch.VERTEX_ATTRIB );
        gl.vertexAttribPointer(SpriteBatch.VERTEX_ATTRIB, 2, gl.FLOAT, false, 0, 0);

        // Index Buffer
        const indices = this.attributes.indices;
        for(let i = 0; i < indices.length; i += 6) {
            indices[i] = 0;
            indices[i+1] = 1;
            indices[i+2] = 2;
            indices[i+3] = 0;
            indices[i+4] = 2;
            indices[i+5] = 3;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SpriteBatch.INDEX_BUFFER);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,  indices, gl.STATIC_DRAW);

        // Texture Coordinate buffer
        const texCoords = this.attributes.a_texCoord;
        for(let i = 0; i < texCoords.length; i += 12) {
            texCoords[i] = 0.0;
            texCoords[i+1] = 1.0;

            texCoords[i+2] = 0.0;
            texCoords[i+3] = 0.0;

            texCoords[i+4] = 1.0;
            texCoords[i+5] = 0.0;

            texCoords[i+6] = 1.0;
            texCoords[i+7] = 1.0;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(SpriteBatch.TEXCOORD_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.TEXCOORD_ATTRIB, 2, gl.FLOAT, false, 0, 0);
        */
    }

    public add(matrix:Matrix3, texCoord:Rect, texCoordPixel:Rect):boolean {
        // http://stackoverflow.com/questions/38853096/webgl-how-to-bind-values-to-a-mat4-attribute
        const vertexOffset = this.count * 8;

        matrix.setVertexData(this.attributes.aVertex, vertexOffset, texCoordPixel);
        /*for(let i = 0; i < quadData.length; i++) {
            this.attributes.a_vertex[offset + i] = quadData[i];
        }*/


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
        /*this.attributes.indices[indexPosOffset + 0] = indexValueOffset + 0;
        this.attributes.indices[indexPosOffset + 1] = indexValueOffset + 1;
        this.attributes.indices[indexPosOffset + 2] = indexValueOffset + 2;
        this.attributes.indices[indexPosOffset + 3] = indexValueOffset + 0;
        this.attributes.indices[indexPosOffset + 4] = indexValueOffset + 2;
        this.attributes.indices[indexPosOffset + 5] = indexValueOffset + 3;*/
        return ++this.count !== this._maxQuadsPerBatch;
    }

    public setTexture(texture:Texture) {
        this._texture = texture;
    }

    public render(gl:WebGLRenderingContext) {
        if (this.count === 0) {
            return;
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture.glTexture);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aVertex, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.attributes.aTexCoord, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SpriteBatch.INDEX_BUFFER);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.attributes.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        gl.enableVertexAttribArray(SpriteBatch.TEXCOORD_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.TEXCOORD_ATTRIB, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER);
        gl.enableVertexAttribArray(SpriteBatch.VERTEX_ATTRIB);
        gl.vertexAttribPointer(SpriteBatch.VERTEX_ATTRIB, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, this.count * 6, gl.UNSIGNED_SHORT, 0);


        this.renderDone();
    }

    public renderDone() {
        this.count = 0;
    }

    protected _setBufferMatrix(index:number, offset:number, matrix:Matrix3) {
        // right = 1st row
        // up = 2nd row
        // center = 3rd row
        /*
        const halfWidth = this._texture.rect.w * 0.5;
        const halfHeight = this._texture.rect.h * 0.5;

        const centerX = matrix.values[6];
        const centerY = matrix.values[7];

        const upX = matrix.values[3] * halfHeight;
        const upY = matrix.values[4] * halfHeight;

        const rightX = matrix.values[0] * halfWidth;
        const rightY = matrix.values[1] * halfWidth;

        // TOP LEFT
        this.attributes[index][offset+2] = centerX - upX - rightX;
        this.attributes[index][offset+3] = centerY - upY - rightY;

        // BOTTOM LEFT
        this.attributes[index][offset]   = centerX + upX - rightX;
        this.attributes[index][offset+1] = centerY + upY - rightY;

        // BOTTOM RIGHT
        this.attributes[index][offset+6] = centerX + upX + rightX;
        this.attributes[index][offset+7] = centerY + upY + rightY;

        // TOP RIGHT
        this.attributes[index][offset+4] = centerX - upX + rightX;
        this.attributes[index][offset+5] = centerY - upY + rightY;

        */
    }

    protected _setBufferRect(index:number, offset:number, rect:Rect) {
        /*
        const quadleft = rect.x;
        const quadright = (rect.x + rect.w);
        const quadtop = rect.y;
        const quadbottom = (rect.y + rect.h);
        this.attributes[index][offset] = quadleft;       this.attributes[index][offset+1] = quadtop;
        this.attributes[index][offset+2] = quadright;    this.attributes[index][offset+3] = quadtop;

        this.attributes[index][offset+4] = quadleft;     this.attributes[index][offset+5] = quadbottom;
        this.attributes[index][offset+6] = quadleft;    this.attributes[index][offset+7] = quadbottom;

        this.attributes[index][offset+8] = quadright;    this.attributes[index][offset+9] = quadtop;
        this.attributes[index][offset+10] = quadright;    this.attributes[index][offset+11] = quadbottom;
        */
    }
}
