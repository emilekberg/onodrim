import { ResourceData } from './resource-data';

export default class Resource {
	public get extension() {
		return this._extension;
	}
	public get url() {
		return this._resourceData.url;
	}
	public get name() {
		return this._resourceData.name;
	}
	private readonly _resourceData: ResourceData;
	private _data: string|Blob|ArrayBuffer|{};
	private readonly _extension: string;
	constructor(data: ResourceData) {
		this._resourceData = data;
		const result = /(?=.)\w*$/g.exec(this.url);
		this._extension = result ? result[0] : '';
	}

	public load(): Promise<any> {
		return fetch(this.url)
			.then((response) => {
				return this.processResponse(response);
			})
			.then((data: string|Blob|ArrayBuffer|{}) => {
				return this._data = data;
			});
	}

	public getData<T extends string|Blob|ArrayBuffer|{}>(): T {
		return this._data as T;
	}

	public processResponse(response: Response) {
		switch (this._extension) {
			case 'ogg':
			case 'mp3':
			case 'm4a':
			case 'aac':
			case 'webm':
			case 'wav':
					return response.arrayBuffer();
			case 'png':
			case 'jpg':
			case 'bmp':
			case 'gif':
			case 'jpeg':
					return response.blob();
			case 'json':
					return response.json();
			default:
					return response.text();
		}
	}
}
