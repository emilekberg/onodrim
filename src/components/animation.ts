import ComponentFactory from './component-factory';
import Sprite, {SpriteTemplate} from './sprite';
import SpriteBatch from '../system/webgl/sprite-batch';
import Entity from '../entity';
import Rect from '../math/rect';
import Texture, {TextureTemplate} from '../resources/texture';
import Time from '../time';
export interface AnimationTemplate extends SpriteTemplate {
    fps?: number;
    frames?: Rect[];
    autoStart?:boolean;
    loop?:boolean;
}
export const enum State {
    STOPPED,
    PLAYING,
    PAUSED
}
export default class Animation extends Sprite {
    public static CreateFrames(texture:Texture|TextureTemplate|undefined,
                               frameSize:Rect|undefined,
                               margin:number = 0,
                               frameStart:number=0,
                               numberOfFrames=-1):Rect[]|undefined {
        if(!texture) {
            return undefined;
        }
        if(!frameSize) {
            return undefined;
        }

        if (!(texture instanceof Texture)) {
            return undefined;
        }

        const frames:Rect[] = [];
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
                                 template:AnimationTemplate,
                                 frameSize:Rect,
                                 margin:number = 0,
                                 frameStart:number=0,
                                 numberOfFrames=-1):Animation {
        template.frames = this.CreateFrames(template.texture, frameSize, margin, frameStart, numberOfFrames);
        return new Animation(entity, template);
    }
    public loop:boolean;

    protected _fps:number;
    protected _numberOfFrames:number;
    protected _frames:Rect[];
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
    set frames(value:Rect[]) {
        this._frames = value;
        this._numberOfFrames = this._frames.length;
    }
    get frames():Rect[] {
        return this._frames;
    }
    constructor(entity:Entity, template:AnimationTemplate) {
        super(entity, template);

        this.fps = template.fps || 24;
        this.frames = template.frames || [];
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

        const rect = this._frames[this._currentFrame];
        const texCoord = new Rect(
            rect.x/this.texture.rect.w,
            rect.y/this.texture.rect.h,
            rect.w/this.texture.rect.w,
            rect.h/this.texture.rect.h
        );
        if (!batch.add(this._renderedMatrix, this.texture, texCoord, this._color)) {
            batch.render();
        }
    }

    public updateTransform() {
        const rect = this._frames[this._currentFrame];
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
ComponentFactory.register(Animation);
