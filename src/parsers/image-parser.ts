import Parser from './parser';
import Resource from '../resources/resource';
import Loader from '../loader';
import ResourceManager from '../resources/resource-manager';
export default class ImageParser extends Parser {
    public canParse(resource :Resource): boolean {
        return /png|jpg|jpeg|bmp|gif/.test(resource.extension);
    }
    public parse(resource: Resource): Promise<{}> {
        const data = resource.getData<Blob>();
        const urlData = window.URL.createObjectURL(data);
        return ResourceManager.loadImage(resource.url, urlData);
    }
}
Loader.addParser(new ImageParser());
