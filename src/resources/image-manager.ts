export interface ImageLoadedEvent {
	url: string;
	image: HTMLImageElement;
}
export default class ImageManager {

	public static loadImage(id: string, url:string = id):Promise<ImageLoadedEvent> {
		const image = this.get(id);
		if (image) {
			return Promise.resolve({
				url,
				image
			});
		}
		return new Promise((resolve) => {
			const imageToLoad = new Image();
			imageToLoad.addEventListener('load', () => {
				resolve({
					url,
					image: imageToLoad
				});
			});
			imageToLoad.src = url;
			this.map.set(id, imageToLoad);
		});
	}
	public static loadImages(urls:string[]):Promise<ImageLoadedEvent[]> {
		return Promise.all(urls.map((url) => {
			return this.loadImage(url);
		}));
	}

	public static has(id: string): boolean {
		return this.map.has(id);
	}

	public static get(id: string): HTMLImageElement|undefined {
		return this.map.get(id);
	}

	private static map = new Map<string, HTMLImageElement>();
}
