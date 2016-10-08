import RenderComponent, {RenderComponentTemplate} from "./render-component";
import Entity from "../entity";
import Texture from "../resources/texture";
import Point from "../math/point";
import RenderSystem from "../system/render-system";
import Matrix from "../math/matrix";
import {lerp} from "../math/interpolation";
export interface SpriteComponentTemplate extends RenderComponentTemplate {
    x?: number;
    y?: number;
    texture?: Texture;
    offset?:Point;
}
export default class SpriteComponent extends RenderComponent {
    public static vertexBuffer:WebGLBuffer;
    public static vertexLocation:number;
    public static texCoordBuffer:WebGLBuffer;
    public static texCoordLocation:number;

    public x:number;
    public y:number;

    public matrixLocation:WebGLUniformLocation;
    public sizeLocation:WebGLUniformLocation;
    public textureOffsetLocation:WebGLUniformLocation;
    public alphaLocation:WebGLUniformLocation;

    protected _w:number;
    protected _h:number;

    protected _offset:Point;
    protected _texture: Texture;

    get texture():Texture {
        return this._texture;
    }

    set offset(value:Point) {
        this._offset = value;
    }
    get offset():Point {
        return this._offset;
    }
    get width():number {
        return this._w * this._renderedMatrix.a;
    }
    get height():number {
        return this._h * this._renderedMatrix.d;
    }
    constructor(entity:Entity, template:SpriteComponentTemplate = {}) {
        super(entity, template);
        this.x       = template.x      || 0;
        this.y       = template.y      || 0;
        this._offset = template.offset || new Point();
        this._w = 0;
        this._h = 0;

        if(template.texture) {
            this.setTexture(template.texture);
        }
    }

    public updateTransform() {
        this._renderState.matrix
            .identity()
            .translate(-this._texture.rect.w*this._offset.x, -this._texture.rect.h*this._offset.y)
            .rotate(this._transform.worldRotation)
            .scale(this._transform.worldScaleX,this._transform.worldScaleY)
            .translate(this._transform.worldX, this._transform.worldY);
    }

    public setTexture(texture:Texture) {
        this._texture = texture;
        this._w = this._texture.image.width;
        this._w = this._texture.image.height;
        this.initGL(RenderSystem.GL, RenderSystem.PROGRAM);
    }

    public initGL(gl:WebGLRenderingContext, program:WebGLProgram) {
        this.matrixLocation = gl.getUniformLocation(program, "u_matrix");
        this.sizeLocation = gl.getUniformLocation(program, "u_size");
        this.textureOffsetLocation = gl.getUniformLocation(program, "u_texCoordOffset");
        this.alphaLocation = gl.getUniformLocation(program, "u_alpha");
    }

    public setVerticeBufferData(gl:WebGLRenderingContext, x:number, y:number, width:number, height:number) {
        let x1 = x;
        let x2 = x+width;
        let y1 = y;
        let y2 = y+height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]), gl.STATIC_DRAW);
    }

    public render(delta:number, gl:WebGLRenderingContext) {
        // http://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html
        // http://webglfundamentals.org/webgl/webgl-2d-geometry-matrix-transform.html
        // http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
        this.interpolateRenderMatrix(delta);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.glTexture);

        gl.uniform2f(this.sizeLocation, this.texture.rect.w, this.texture.rect.h);
        gl.uniform4f(this.textureOffsetLocation, 0, 0, 1, 1);
        gl.uniformMatrix3fv(this.matrixLocation, false, this._renderedMatrix.values);
        gl.uniform1f(this.alphaLocation, this._renderState.alpha);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    public interpolateRenderMatrix(delta:number) {
        let m1 = this._oldRenderState.matrix;
        let m2 = this._renderState.matrix;

        for(let i = 0; i < Matrix.count; i++) {
            this._renderedMatrix.values[i] = lerp(delta, m1.values[i], m1.values[i]-m2.values[i], 1);
        }
    }
}
