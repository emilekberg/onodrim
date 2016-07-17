import Loader from 'resource-loader';
import ResourceManager from './resource-manager'
export default class Texture {
    image: HTMLImageElement;
    loaded:any;
    url:string;
    constructor(url:string) {
        if (ResourceManager.isImageLoaded(url)) {
            this.image = ResourceManager.getImage(url);
        }
        else {
            ResourceManager.loadImage(url);
            this.image = ResourceManager.getImage(url);
        }
        this.url = url;
    }
}