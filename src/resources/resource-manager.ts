interface ImageLoadedEvent {
    url: string;
    image: HTMLImageElement
}
export default class ResourceManager {
    protected static _images:{[id:string]:HTMLImageElement} = {};
    static loadImage(url:string):Promise<ImageLoadedEvent> {
        return new Promise((resolve, reject) => {
            if (this.isImageLoaded(url)) {
                resolve(this._images[url]);
            }
            let image = new Image();
            image.addEventListener('load', resolve.bind(null, {
                url: url,
                image: image
            }));
            image.src = url;
            this._images[url] = image;
        });
    }
    static getImage(url:string) {
        return this._images[url];
    }
    static loadImages(url:Array<string>):Promise<Array<ImageLoadedEvent>> {
        return Promise.all(url.map((value) => {
            return this.loadImage(value);
        }));
    }
    static isImageLoaded(url:string):boolean {
        return this._images[url] !== undefined;
    }
}