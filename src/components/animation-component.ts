import SpriteComponent, {SpriteComponentTemplate} from './sprite-component'
import Entity from '../entity'
import Rect from '../math/rect'
import Texture from '../resources/texture'
import Time from '../time'
interface AnimationComponentTemplate extends SpriteComponentTemplate {
    fps?: number;
    frames?: Array<Rect>;
    autoStart?:boolean;
    loop?:boolean;
}
const enum State {
    STOPPED,
    PLAYING,
    PAUSED
}
export default class AnimationComponent extends SpriteComponent {
    static CreateFrames(texture:Texture, frameSize:Rect, margin:number = 0, frameStart:number=0, numberOfFrames=-1):Array<Rect> {
        let frames:Array<Rect> = [];
        for(let y = 0; y < texture.image.height; y+= frameSize.h + margin) {
            for(let x = 0; x < texture.image.width; x+= frameSize.w + margin) {
                if(y*x + x < frameStart) {
                    continue;
                }
                if((frames.length >= numberOfFrames && numberOfFrames != -1)) {
                    return frames;
                }
                frames.push(new Rect(x, y, frameSize.w, frameSize.h));                
            }
        }
        return frames;
    }
    static CreateFromRect(entity:Entity, template:AnimationComponentTemplate, frameSize:Rect, margin:number = 0, frameStart:number=0, numberOfFrames=-1):AnimationComponent {
        template.frames = this.CreateFrames(template.texture, frameSize, margin, frameStart, numberOfFrames);
        return new AnimationComponent(entity, template);
    }
    protected _fps:number;
    protected _numberOfFrames:number;
    protected _frames:Array<Rect>;
    protected _currentFrame:number;
    protected _nextFrameTime:number;
    protected _frameTime:number;
    protected _state:State;
    loop:boolean;
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

    update() {
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
    _playing() {
        while(Time.now() >= this._nextFrameTime) {
            this._currentFrame = ((this._currentFrame + 1) % this._numberOfFrames);
            this._nextFrameTime += this._frameTime;
        }
    }
    play() {
        this._state = State.PLAYING;
        this._nextFrameTime = Time.now() + this._frameTime;
    }
    pause() {
        this._state = State.PAUSED;
    }
    stop() {
        this._state = State.STOPPED;
        this._currentFrame = 0;
    }

    render(delta:number, ctx:CanvasRenderingContext2D) {
        if(!this.isVisible() || !this._texture ||this._numberOfFrames == 0) {
            return;
        }
        this.interpolateRenderMatrix(delta);
        ctx.setTransform(
            this._renderedMatrix.a,
            this._renderedMatrix.b,
            this._renderedMatrix.c,
            this._renderedMatrix.d,
            this._renderedMatrix.tx,
            this._renderedMatrix.ty
        );
        let rect = this._frames[this._currentFrame];
        ctx.drawImage(
            this._texture.image, 
            rect.x, 
            rect.y, 
            rect.w, 
            rect.h, 
            0,//-rect.w*this._offset.x, 
            0,//-rect.h*this._offset.y, 
            rect.w, 
            rect.h
        );
        this.requireDepthSort = false;
    }
}