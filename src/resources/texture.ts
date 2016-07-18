import ResourceManager from './resource-manager'
import Rect from '../math/rect'
export default class Texture {
    image: HTMLImageElement;
    loaded:any;
    url:string;
    rect:Rect;
    constructor(url:string) {
        if (ResourceManager.isImageLoaded(url)) {
            this.image = ResourceManager.getImage(url);
        }
        else {
            ResourceManager.loadImage(url);
            this.image = ResourceManager.getImage(url);
        }
        this.url = url;

        this.rect = new Rect(0,0,this.image.width, this.image.height);
    }
}