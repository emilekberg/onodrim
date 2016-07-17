import Loader from 'resource-loader';

export default class Texture {
    image: HTMLImageElement;
    loaded:any;
    url:string;
    constructor(url:string) {
        this.url = url;
        this.load().then(this.onLoaded.bind(this));
    }
    load():Promise<()=>void> {
        this.image = new Image();
        return new Promise((resolve) => {
            this.image.addEventListener('load', resolve);
            this.image.src = this.url;
        });
    }
    onLoaded(l) {
        this.loaded = l;
    }
}