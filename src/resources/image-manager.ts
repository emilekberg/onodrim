export interface ImageLoadedEvent {
	url: string;
	image: HTMLImageElement;
}
export default class ImageManager {

	public static loadImage(id: string, url:string = id):Promise<ImageLoadedEvent> {
		if (this.has(id)) {
			return Promise.resolve({
				url,
				image: this.get(id)
			});
		}
		return new Promise((resolve) => {
			const image = new Image();
			image.addEventListener('load', () => {
				resolve({
					url,
					image
				});
			});
			image.src = url;
			this.map.set(id, image);
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
