// http://stackoverflow.com/questions/15561871/the-fastest-way-to-batch-calls-in-webgl
import {Rect} from "../../math";
export default class SpriteBatch {
    public static VERTEX_BUFFER: WebGLBuffer;
    public static VERTEX_LOCATION:number;
    public static TEXCOORD_BUFFER:WebGLBuffer;
    public static TEXCOORD_LOCATION:number;

    public vertices:Float32Array;
    public textureCoords:Float32Array;
    public count:number;
    public size:number;

    protected _maxQuadsPerBatch:number;
    protected _vertsPerQuad:number;
    protected _floatsPerVert:number;

    protected _texture:WebGLTexture;
    constructor(maxQuadsPerBatch:number = 100, vertsPerQuad:number = 6, floatsPerVert:number = 2) {
        this._maxQuadsPerBatch = maxQuadsPerBatch;
        this._vertsPerQuad = vertsPerQuad;
        this._floatsPerVert = floatsPerVert;

        this.size = this._maxQuadsPerBatch * this._vertsPerQuad * this._floatsPerVert;
        this.vertices = new Float32Array(this.size);
        this.textureCoords = new Float32Array(this.size);
        this.count = 0;
    }

    public add(quad:Rect, texCoord:Rect):boolean {
        let offset = this.count * this._vertsPerQuad * this._floatsPerVert;
        /*
        0, 0,
        1, 0,

        0, 1,
        0, 1,
        1, 0,
        1, 1
        */
        const quadleft = quad.x;
        const quadright = (quad.x + quad.w);
        const quadtop = quad.y;
        const quadbottom = (quad.y + quad.h);
        this.vertices[offset] = quadleft;       this.vertices[offset+1] = quadtop;
        this.vertices[offset+2] = quadright;    this.vertices[offset+3] = quadtop;

        this.vertices[offset+4] = quadleft;     this.vertices[offset+5] = quadbottom;
        this.vertices[offset+6] = quadleft;    this.vertices[offset+7] = quadbottom;

        this.vertices[offset+8] = quadright;    this.vertices[offset+9] = quadtop;
        this.vertices[offset+10] = quadright;    this.vertices[offset+11] = quadbottom;

        const texleft = texCoord.x;
        const texright = (texCoord.x + texCoord.w);
        const textop = texCoord.y;
        const texbottom = (texCoord.y + texCoord.h);
        this.textureCoords[offset] = texleft;       this.textureCoords[offset+1] = textop;
        this.textureCoords[offset+2] = texright;    this.textureCoords[offset+3] = textop;

        this.textureCoords[offset+4] = texleft;     this.textureCoords[offset+5] = texbottom;
        this.textureCoords[offset+6] = texleft;    this.textureCoords[offset+7] = texbottom;

        this.textureCoords[offset+8] = texright;    this.textureCoords[offset+9] = textop;
        this.textureCoords[offset+10] = texright;    this.textureCoords[offset+11] = texbottom;
        this.count++;

        return this.count !== this._maxQuadsPerBatch;
    }

    public setTexture(texture:WebGLTexture) {
        this._texture = texture;
    }

    public render(gl:WebGLRenderingContext) {
        if (this.count === 0) {
            return;
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.VERTEX_BUFFER);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        // gl.vertexAttribPointer(SpriteBatch.VERTEX_LOCATION, this._floatsPerVert, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteBatch.TEXCOORD_BUFFER);
        // gl.vertexAttribPointer(SpriteBatch.TEXCOORD_LOCATION, this._floatsPerVert, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureCoords, gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, this.count * this._vertsPerQuad);

        this.renderDone();
    }

    public renderDone() {
        this.count = 0;
    }
}
