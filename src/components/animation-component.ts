import SpriteComponent, {SpriteComponentTemplate} from "./sprite-component";
import SpriteBatch from "../system/webgl/sprite-batch";
import Entity from "../entity";
import Rect from "../math/rect";
import Texture from "../resources/texture";
import Time from "../time";
export interface AnimationComponentTemplate extends SpriteComponentTemplate {
    fps?: number;
    frames?: Array<Rect>;
    autoStart?:boolean;
    loop?:boolean;
}
export const enum State {
    STOPPED,
    PLAYING,
    PAUSED
}
export default class AnimationComponent extends SpriteComponent {
    public static CreateFrames(texture:Texture,
                               frameSize:Rect,
                               margin:number = 0,
                               frameStart:number=0,
                               numberOfFrames=-1):Array<Rect> {
        let frames:Array<Rect> = [];
        for(let y = 0; y < texture.image.height; y+= frameSize.h + margin) {
            for(let x = 0; x < texture.image.width; x+= frameSize.w + margin) {
                if(y*x + x < frameStart) {
                    continue;
                }
                if((frames.length >= numberOfFrames && numberOfFrames !== -1)) {
                    return frames;
                }
                frames.push(new Rect(x, y, frameSize.w, frameSize.h));
            }
        }
        return frames;
    }

    public static CreateFromRect(entity:Entity,
                                 template:AnimationComponentTemplate,
                                 frameSize:Rect,
                                 margin:number = 0,
                                 frameStart:number=0,
                                 numberOfFrames=-1):AnimationComponent {
        template.frames = this.CreateFrames(template.texture, frameSize, margin, frameStart, numberOfFrames);
        return new AnimationComponent(entity, template);
    }
    public loop:boolean;

    protected _fps:number;
    protected _numberOfFrames:number;
    protected _frames:Array<Rect>;
    protected _currentFrame:number;
    protected _nextFrameTime:number;
    protected _frameTime:number;
    protected _state:State;

    set fps(value:number) {
        this._fps = value;
        this._frameTime = 1/this._fps;
    }
    get fps():number {
        return this._fps;
    }
    set frames(value:Array<Rect>) {
        this._frames = value;
        this._numberOfFrames = this._frames.length;
    }
    get frames():Array<Rect> {
        return this._frames;
    }
    constructor(entity:Entity, template:AnimationComponentTemplate = {}) {
        super(entity, template);

        this.fps = template.fps || 24;
        this.frames = template.frames || [];
        this._texture = template.texture || null;
        this._state = State.STOPPED;
        this._currentFrame = 0;
        this.loop = false;
        if(template.autoStart) {
            this.play();
        }
    }

    public update() {
        switch(this._state) {
            case State.PLAYING:
                this._playing();
                break;
            case State.STOPPED:
            case State.PAUSED:
            default:

                break;
        }
    }

    public play() {
        this._state = State.PLAYING;
        this._nextFrameTime = Time.now() + this._frameTime;
    }
    public pause() {
        this._state = State.PAUSED;
    }
    public stop() {
        this._state = State.STOPPED;
        this._currentFrame = 0;
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
        const rect = this._frames[this._currentFrame];
        const texCoord = new Rect(
            rect.x/this.texture.rect.w,
            rect.y/this.texture.rect.h,
            rect.w/this.texture.rect.w,
            rect.h/this.texture.rect.h
        );
        if (!batch.add(this._renderedMatrix, this.texture, texCoord, rect)) {
            batch.render(gl);
        }
        /*
        this.interpolateRenderMatrix(delta);
        let rect = this._frames[this._currentFrame];

        if (!SpriteComponent.previousTexture || this.texture.url !== SpriteComponent.previousTexture.url) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture.glTexture);
            SpriteComponent.previousTexture = this.texture;
        }

        gl.uniform2f(this.sizeLocation, rect.w, rect.h);
        gl.uniformMatrix3fv(this.matrixLocation, false, this._renderedMatrix.values);
        gl.uniform4f(
            this.textureOffsetLocation,
            rect.x/this.texture.rect.w,
            rect.y/this.texture.rect.h,
            rect.w/this.texture.rect.w,
            rect.h/this.texture.rect.h
        );
        gl.uniform1f(this.alphaLocation, this.alpha);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        */
    }

    public updateTransform() {
        let rect = this._frames[this._currentFrame];
        this._renderState.matrix
            .identity()
            .translate(-rect.w*this._offset.x, -rect.h*this._offset.y)
            .rotate(this._transform.worldRotation)
            .scale(this._transform.worldScaleX,this._transform.worldScaleY)
            .translate(this._transform.worldX, this._transform.worldY);
    }

    protected _playing() {
        while(Time.now() >= this._nextFrameTime) {
            this._currentFrame = ((this._currentFrame + 1) % this._numberOfFrames);
            this._nextFrameTime += this._frameTime;
        }
    }
}
