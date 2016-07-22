import RenderComponent, {RenderComponentTemplate} from './render-component'
import TransformComponent from './transform-component'
import Entity from '../entity'
import Texture from '../resources/texture'
import Point from '../math/point'
import WebGLRenderer from '../systems/webgl-renderer'
import Matrix from '../math/matrix'
export interface SpriteComponentTemplate extends RenderComponentTemplate {
    x?: number;
    y?: number;
    texture?: Texture;
    offset?:Point;
}
export default class SpriteComponent extends RenderComponent {
    protected _texture: Texture;
    x:number;
    y:number;
    protected _w:number;
    protected _h:number;

    protected _offset:Point;

    positionLocation:number;
    vertexBuffer:WebGLBuffer;
    texCoordLocation:number;
    texCoordBuffer:WebGLBuffer;
    matrixLocation:WebGLUniformLocation;
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

    updateTransform() {
        this._matrix
            .identity()
            .translate(-this._texture.rect.w*this._offset.x, -this._texture.rect.h*this._offset.y)
            .rotate(this._transform.state.rotation)
            .scale(this._transform.state.scaleX,this._transform.state.scaleY)
            .translate(this._transform.state.x, this._transform.state.y);
    }

    setTexture(texture:Texture) {
        this._texture = texture;
        this._w = this._texture.image.width;
        this._w = this._texture.image.height;

        if (WebGLRenderer.gl) {
            this.initGL(WebGLRenderer.gl, WebGLRenderer.program);
        }
    }

    render(delta:number, ctx:CanvasRenderingContext2D) {
        if(!this.isVisible() ||!this._texture) {
            return;
        }
        this.interpolateRenderMatrix(delta, ctx);
        ctx.setTransform(
            this._renderedMatrix.a,
            this._renderedMatrix.b,
            this._renderedMatrix.c,
            this._renderedMatrix.d,
            this._renderedMatrix.tx,
            this._renderedMatrix.ty
        );
        ctx.drawImage(
            this._texture.image, 
            this._texture.rect.x, 
            this._texture.rect.y, 
            this._texture.rect.w, 
            this._texture.rect.h, 
            0,//-this._texture.rect.w*this._offset.x, 
            0,//-this._texture.rect.h*this._offset.y, 
            this._texture.rect.w, 
            this._texture.rect.h
        );
        this.requireDepthSort = false;
    }

    initGL(gl:WebGLRenderingContext, program:WebGLProgram) {
        this.positionLocation = gl.getAttribLocation(program, 'a_position');
        this.texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
        this.matrixLocation = gl.getUniformLocation(program, 'u_matrix');
        
        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.setVerticeBufferData(gl, 0, 0, this.texture.rect.w, this.texture.rect.h);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0
        ]), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(this.texCoordLocation);
        gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

        this.setVerticeBufferData(gl, this.x, this.y, this.texture.rect.w, this.texture.rect.h);
    }

    setVerticeBufferData(gl:WebGLRenderingContext, x:number, y:number, width:number, height:number) {
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

    renderWebGL(delta:number, gl:WebGLRenderingContext) {
        //http://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html
        //http://webglfundamentals.org/webgl/webgl-2d-geometry-matrix-transform.html
        //http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
        this.interpolateRenderMatrix(delta, null)

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.glTexture);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix3fv(this.matrixLocation, false, this._renderedMatrix.values);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    interpolateRenderMatrix(delta:number, ctx:CanvasRenderingContext2D) {
        let m1 = this._oldMatrix;
        let m2 = this._matrix;

        for(let i = 0; i < this._matrix.values.length; i++) {
            this._renderedMatrix.values[i] = this.lerp(delta, m1.values[i], m1.values[i]-m2.values[i], 1);
        }
    }
}