import Resource from './resources/resource';
import Parser from './parser';
import { ResourceData } from './resources/resource-data';

export class Loader {
	private readonly _parsers: Parser[];
	private readonly _assetsToLoad: ResourceData[];
	private readonly _loadedResource: Resource[];
	private readonly _loadingResources: Resource[];

	private _resolve: () => void;
	constructor() {
		this._assetsToLoad = [];
		this._parsers = [];
		this._loadingResources = [];
		this._loadedResource = [];
	}
	public add(url: string, name: string = url): Loader {
		this._assetsToLoad.push({
			url,
			name
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

	private load(resourceData: ResourceData): Promise<any> {
		const index = this._assetsToLoad.indexOf(resourceData);
		this._assetsToLoad.splice(index, 1);
		const resource = new Resource(resourceData);
		this._loadingResources.push(resource);
		return resource.load().then(() => {
			return this.parse(resource);
		})
		.then(() => {
			this.onDone(resource);
		});
	}

	private parse(resource: Resource): Promise<Resource> {
		const parsers = this._parsers.filter((parser) => {
			return parser.canParse(resource);
		});
		if (!parsers.length) {
			return Promise.resolve(resource);
		}
		let parsed = 0;
		return new Promise((resolve, reject) => {
			parsers.forEach((parser) => {
				parser.parse(resource).then(() => {
					if (parsers.length === ++parsed) {
						resolve(resource);
					}
				});
			});
		});
	}

	private onDone(resource: Resource) {
		this._loadingResources.splice(this._loadingResources.indexOf(resource), 1);
		this._loadedResource.push(resource);
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
		return this._loadingResources.length === 0;
	}
}
const loader = new Loader();
export default loader;
