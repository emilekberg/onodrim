import ComponentFactory from './component-factory';
import Sprite, {SpriteTemplate} from './sprite';
import SpriteBatch from '../system/webgl/batching/sprite-batch';
import Entity from '../entity';
import Rect, { RectTemplate } from '../math/rect';
import Texture, {TextureTemplate} from '../resources/texture';
import Time from '../time';
export interface AnimationTemplate extends SpriteTemplate {
	fps?: number;
	frames?: Rect[];
	autoStart?:boolean;
	loop?:boolean;
	framesFromRect?: RectTemplate;
}
export const enum State {
	STOPPED,
	PLAYING,
	PAUSED
}
export default class Animation extends Sprite {
	// TODO: refactor helper methods
	public static CreateFrames(
		texture:Texture|TextureTemplate|undefined,
		frameSize:RectTemplate|undefined,
		margin:number = 0,
		frameStart:number=0,
		numberOfFrames=-1):Rect[]|undefined {
			if(!texture) {
				return undefined;
			}
			if(!frameSize) {
				return undefined;
			}
			const textureResource = !(texture instanceof Texture) ? new Texture(texture) : texture;

			const frames:Rect[] = [];
			for(let y = 0; y < textureResource.image.height; y+= frameSize.h + margin) {
				for(let x = 0; x < textureResource.image.width; x+= frameSize.w + margin) {
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

	public static CreateFromRect(
		entity:Entity,
		template:AnimationTemplate,
		frameSize:RectTemplate,
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
	protected _needsTransformUpdate: boolean;
	protected _textureCoordinates: Rect;

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
		if (template.framesFromRect) {
			const frames = Animation.CreateFrames(template.texture, template.framesFromRect);
			if (frames) {
					this.frames = frames;
			}
		}
		else {
			this.frames = template.frames || [];
		}
		this._state = State.STOPPED;
		this._currentFrame = 0;
		this.loop = false;
		this._needsTransformUpdate = false;
		this._textureCoordinates = new Rect();
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
		this._needsTransformUpdate = true;
	}
	public pause() {
		this._state = State.PAUSED;
	}
	public stop() {
		this._state = State.STOPPED;
		this._currentFrame = 0;
	}

	public render(delta:number, gl:WebGL2RenderingContext, batch:SpriteBatch) {
		this.interpolateRenderMatrix(delta);
		batch.render(this._renderedMatrix, this.texture, this._textureCoordinates, this._color);
	}

	public updateTransform()
	{
		if (this._needsTransformUpdate || this._transform.wasDirty) {
			const rect = this._frames[this._currentFrame];
			this._renderState.matrix
					.identity()
					.scale(rect.w * 0.5, rect.h * 0.5)
					.multiply(this._transform.worldMatrix);
			this._needsTransformUpdate = false;
		}
	}

	protected _playing() {
		while(Time.now() >= this._nextFrameTime) {
			this._currentFrame = ((this._currentFrame + 1) % this._numberOfFrames);
			this._nextFrameTime += this._frameTime;
			this._needsTransformUpdate = true;

			const rect = this._frames[this._currentFrame];
			this._textureCoordinates.set(
				rect.x/this.texture.rect.w,
				rect.y/this.texture.rect.h,
				rect.w/this.texture.rect.w,
				rect.h/this.texture.rect.h
			);
		}
	}
}
ComponentFactory.register(Animation, 'onodrim.animation');
