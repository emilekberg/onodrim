export interface ImageLoadedEvent {
	url: string;
	image: HTMLImageElement;
}
export default class ResourceManager {
	public static loadImage(key: string, url:string):Promise<ImageLoadedEvent> {
		return new Promise((resolve, reject) => {
			if(this.isImageLoaded(key)) {
					resolve({
						key,
						image: this._IMAGES[key]
					});
			}
			const image = new Image();
			image.addEventListener('load', () => {
					resolve({
						key,
						image
					});
			});
			image.src = url;
			this._IMAGES[key] = image;
		});
	}
	public static getImage(url:string) {
		return this._IMAGES[url];
	}
	public static loadImages(url:string[]):Promise<ImageLoadedEvent[]> {
		return Promise.all(url.map((value) => {
			return this.loadImage(value, value);
		}));
	}
	public static isImageLoaded(url:string):boolean {
		return this._IMAGES[url] !== undefined;
	}
	protected static _IMAGES:{[id:string]:HTMLImageElement} = {};
}
