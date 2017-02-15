import ComponentFactory from './component-factory';
import RenderComponent, {RenderComponentTemplate} from './render-component';
import Entity from '../entity';
import Texture, {TextureTemplate} from '../resources/texture';
import Point, {PointTemplate} from '../math/point';
import WebGLSystem from '../system/webgl/webgl-system';
import SpriteBatch from '../system/webgl/sprite-batch';
import {Value} from '../math/matrix3';

export interface SpriteTemplate extends RenderComponentTemplate {
    texture: TextureTemplate|Texture;
    x?: number;
    y?: number;
    offset?: PointTemplate;
}
export default class Sprite extends RenderComponent {
    public x:number;
    public y:number;
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
    constructor(entity:Entity, template:SpriteTemplate) {
        super(entity, template);
        this.x = template.x || 0;
        this.y = template.y || 0;
        this._offset = new Point();
        if (template.offset) {
            this._offset.set(template.offset.x, template.offset.y);
        }
        this._w = 0;
        this._h = 0;
        if(template.texture) {
            let texture: Texture;
            if (template.texture instanceof Texture) {
                texture = template.texture;
            }
            else {
                texture = new Texture(template.texture);
            }
            this.setTexture(texture);
        }
    }

    public updateTransform() {
        if(!this._renderState.wasDirty) {
            return;
        }
        this._renderState.matrix
            .identity()
            .translate(-this._texture.rect.w * (this._offset.x - 0.5), -this._texture.rect.h * (this._offset.y - 0.5))
            .rotate(this._transform.worldRotation)
            .scale(this._transform.worldScaleX,this._transform.worldScaleY)
            .translate(
                this._transform.worldX + ((this.x * this._transform.worldScaleX)),
                this._transform.worldY + ((this.y * this._transform.worldScaleY))
            );
    }

    public setTexture(texture:Texture) {
        this._texture = texture;
        this._w = this._texture.image.width;
        this._h = this._texture.image.height;
    }

    public setVerticeBufferData(gl:WebGLRenderingContext, x:number, y:number, width:number, height:number) {
        const x1 = x;
        const x2 = x+width;
        const y1 = y;
        const y2 = y+height;
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
        this.interpolateRenderMatrix(delta);

        if (!batch.add(this._renderedMatrix, this.texture, this.texture.glRect, this.texture.rect, this._color)) {
            batch.render(gl);
        }
    }
}
ComponentFactory.register(Sprite);
