import Parser from './parser';
import Resource from '../resources/resource';
import Loader from '../loader';
import ResourceManager from '../resources/resource-manager';
export interface Bundle {
    bundle: Array<{url: string}>;
}
export default class BundleParser extends Parser {
    public canParse(resource: Resource): boolean {
        const isJSON = /json/.test(resource.extension);
        const isBundle = resource.getData<{}>().hasOwnProperty('bundle');
        return isJSON && isBundle;
    }
    public parse(resource: Resource): Promise<{}> {
        const data = resource.getData<Bundle>();
        data.bundle.forEach((asset) => {
            const url = resource.url.substring(0, resource.url.lastIndexOf('/')+1) + asset.url;
            Loader.add(url);
        });
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}
Loader.addParser(new BundleParser());
