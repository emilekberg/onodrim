import Resource, {ResourceData} from './resources/resource';
import Parser from './parsers/image-parser';
export interface LoaderData {
	loaded: {[key: string]: Resource};
}

export class Loader {
	private readonly _parsers: Parser[];
	private readonly _assetsToLoad: ResourceData[];
	private readonly _loadedAssets: Resource[];
	private readonly _loadingAssets: Resource[];

	private _resolve: () => void;
	constructor() {
		this._assetsToLoad = [];
		this._parsers = [];
		this._loadingAssets = [];
		this._loadedAssets = [];
	}
	public add(url: string, name?: string): Loader {
		this._assetsToLoad.push({
			url,
			name: name ? name : url
		});
		return this;
	}

	public addParser(parser: Parser): Loader {
		this._parsers.push(parser);
		return this;
	}

	public start(): Promise<Resource[]> {
		this.loadAssets();
		return new Promise((resolve, reject) => {
			this._resolve = resolve;
		});
	}

	private load(asset: ResourceData): Promise<any> {
		const index = this._assetsToLoad.indexOf(asset);
		this._assetsToLoad.splice(index, 1);
		const resource = new Resource(asset);
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
		this.loadAssets();
		if(this.isDone()) {
			this._resolve();
		}
	}

	private loadAssets() {
		if (this._assetsToLoad.length > 0) {
			this._assetsToLoad.forEach((asset) => {
					this.load(asset);
			});
		}
	}

	private isDone(): boolean {
		return this._loadingAssets.length === 0;
	}
}
const loader = new Loader();
export default loader;
