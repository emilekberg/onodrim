import Resource from './resources/resource';
import Parser from './parsers/image-parser';
export interface LoaderData {
    loaded: {[key: string]: Resource}
}
export class Loader {
    private readonly _parsers: Parser[];
    private readonly _assetsToLoad: string[];
    private readonly _loadedAssets: Resource[];
    private readonly _loadingAssets: Resource[];

    private _resolve: Function;
    constructor() {
        this._assetsToLoad = [];
        this._parsers = [];
        this._loadingAssets = [];
        this._loadedAssets = [];
    }
    public add(url: string): Loader {
        this._assetsToLoad.push(url);
        return this;
    }

    public addParser(parser: Parser): void {
        this._parsers.push(parser);
    }

    public start(): Promise<Resource[]> {
        this._assetsToLoad.forEach((url) => {
            this.load(url);
        });
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
        });
    }

    private load(url: string): Promise<any> {
        const index = this._assetsToLoad.indexOf(url);
        this._assetsToLoad.splice(index, 1);
        const resource = new Resource(url);
        this._loadingAssets.push(resource);
        return resource.load().then(() => {
            return this.parse(resource);
        })
        .then(() => {
            this.onDone(resource);
        });
    }

    private parse(resource: Resource): Promise<Resource> {
        let counter = 0;
        let done = 0;
        return new Promise((resolve, reject) => {
            const parsers = this._parsers.filter((parser) => {
                return parser.canParse(resource);
            });
            if (parsers.length === 0) {
                resolve(resource);
                return;
            }
            parsers.forEach((parser) => {
                counter++;
                parser.parse(resource).then(() => {
                    done++;
                    if (counter === done) {
                        resolve(resource);
                    }
                });
            });
        });
    }

    private onDone(resource: Resource) {
        this._loadingAssets.splice(this._loadingAssets.indexOf(resource), 1);
        this._loadedAssets.push(resource);
        if (this._assetsToLoad.length > 0) {
            this._assetsToLoad.forEach((url) => {
                this.load(url);
            });
        }
        else if (this._loadingAssets.length === 0) {
            this._resolve();
        }
    }
}
const loader = new Loader();
export default loader;
