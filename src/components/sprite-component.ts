import RenderComponent, {RenderComponentTemplate} from "./render-component";
import Entity from "../entity";
import Texture from "../resources/texture";
import Point from "../math/point";
import WebGLSystem from "../system/webgl/webgl-system";
import SpriteBatch from "../system/webgl/sprite-batch";
import {Value} from "../math/matrix3";
export interface SpriteComponentTemplate extends RenderComponentTemplate {
    x?: number;
    y?: number;
    texture?: Texture;
    offset?:Point;
}
export default class SpriteComponent extends RenderComponent {
    public static vertexBuffer:WebGLBuffer;
    public static vertexLocation:number;
    public static vertexIndexBuffer:WebGLBuffer;
    public static vertexIndexLocation:number;
    public static texCoordBuffer:WebGLBuffer;
    public static texCoordLocation:number;
    public static previousTexture:Texture;

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
        return this._w * this._renderedMatrix.values[Value.a];
    }
    get height():number {
        return this._h * this._renderedMatrix.values[Value.d];
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
        this.initGL(WebGLSystem.GL, WebGLSystem.PROGRAM);
    }

    public initGL(gl:WebGLRenderingContext, program:WebGLProgram) {
        /*this.matrixLocation = gl.getUniformLocation(program, "u_matrix");
        this.sizeLocation = gl.getUniformLocation(program, "u_size");
        this.textureOffsetLocation = gl.getUniformLocation(program, "u_texCoordOffset");
        this.alphaLocation = gl.getUniformLocation(program, "u_alpha");*/
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

    public render(delta:number, gl:WebGLRenderingContext, batch:SpriteBatch) {
        // http://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html
        // http://webglfundamentals.org/webgl/webgl-2d-geometry-matrix-transform.html
        // http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
        this.interpolateRenderMatrix(delta);

        /*if (!SpriteComponent.previousTexture || this.texture.url !== SpriteComponent.previousTexture.url) {
            batch.render(gl);
            batch.setTexture(this.texture);
            /*
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture.glTexture);

            SpriteComponent.previousTexture = this.texture;
        }*/

        if (!batch.add(this._renderedMatrix, this.texture, this.texture.glRect, this.texture.rect)) {
            batch.render(gl);
        }
        /*
        gl.uniform2f(this.sizeLocation, this.texture.rect.w, this.texture.rect.h);
        gl.uniform4f(this.textureOffsetLocation, 0, 0, 1, 1);
        gl.uniformMatrix3fv(this.matrixLocation, false, this._renderedMatrix.values);
        gl.uniform1f(this.alphaLocation, this._renderState.alpha);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        */
    }
}
