export interface ImageLoadedEvent {
    url: string;
    image: HTMLImageElement;
}
export default class ResourceManager {
    public static loadImage(url:string):Promise<ImageLoadedEvent> {
        return new Promise((resolve, reject) => {
            if(this.isImageLoaded(url)) {
                resolve(this._IMAGES[url]);
            }
            let image = new Image();
            image.addEventListener("load", resolve.bind(null, {
                url: url,
                image: image
            }));
            image.src = url;
            this._IMAGES[url] = image;
        });
    }
    public static getImage(url:string) {
        return this._IMAGES[url];
    }
    public static loadImages(url:Array<string>):Promise<Array<ImageLoadedEvent>> {
        return Promise.all(url.map((value) => {
            return this.loadImage(value);
        }));
    }
    public static isImageLoaded(url:string):boolean {
        return this._IMAGES[url] !== undefined;
    }
    protected static _IMAGES:{[id:string]:HTMLImageElement} = {};
}
