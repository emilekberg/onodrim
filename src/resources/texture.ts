import ResourceManager from './resource-manager';
import Rect, {RectTemplate} from '../math/rect';
import {PointTemplate} from '../math/point';
import WebGLSystem from '../system/webgl/webgl-system';
export interface TextureTemplate {
	url: string;
	x?: number;
	y?: number;
	w?: number;
	h?: number;
}
export default class Texture {
	private static WEBGL_TEXTURES:{[id:string]:WebGLTexture} = {};
	public image: HTMLImageElement;
	public loaded:any;
	public url:string;
	public rect:Rect;
	public glRect:Rect;
	public glTexture:WebGLTexture|null;
	constructor(template:TextureTemplate) {
		if(!ResourceManager.isImageLoaded(template.url)) {
			ResourceManager.loadImage(template.url, template.url);
		}
		this.image = ResourceManager.getImage(template.url);
		this.url = template.url;
		this.rect = new Rect(0,0,this.image.width, this.image.height);
		this.glRect = new Rect(0,0,1,1);
		this.setFrame(
			template.x || 0, template.y || 0,
			template.w || this.image.width , template.h || this.image.height
		);
		if (!Texture.WEBGL_TEXTURES[template.url]) {
			this.createGLTexture(WebGLSystem.GL);
			if (!this.glTexture) {
					return;
			}
			Texture.WEBGL_TEXTURES[template.url] = this.glTexture;
		}
		else {
			this.glTexture = Texture.WEBGL_TEXTURES[template.url];
		}
	}

	public setFrame(x:number, y: number, w: number, h: number) {
		this.rect.x = x;
		this.rect.y = y;
		this.rect.w = w;
		this.rect.h = h;
		this.glRect.x = x/this.image.width;
		this.glRect.y = y/this.image.height;
		this.glRect.w = w/this.image.width;
		this.glRect.h = h/this.image.height;
	}

	protected createGLTexture(gl:WebGLRenderingContext) {
		this.glTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}
