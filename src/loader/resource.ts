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
	private _data: any;
	private readonly _mimeType: string;
	private readonly _responseType: XMLHttpRequestResponseType;
	private readonly _extension: string;
	constructor(data: ResourceData) {
		this._resourceData = data;
		const result = /(?=.)\w*$/g.exec(this.url);
		this._extension = result ? result[0] : '';
		this._mimeType = this.getMimeType();
		this._responseType = this.getResponseType();
	}

	public load(): Promise<Resource> {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.responseType = this._responseType;
			request.open('GET', this.url);
			request.addEventListener('load', (e) => {
				this.onLoad(e);
				resolve(this);
			});
			request.send();
		});
	}

	public onLoad(e: Event) {
		const target = e.target as XMLHttpRequest;
		this._data = target.response;
	}

	public getData<T>(): T {
		return this._data as T;
	}

	public getResponseType(): XMLHttpRequestResponseType {
		switch (this._extension) {
			case 'ogg':
			case 'mp3':
			case 'm4a':
			case 'aac':
			case 'webm':
			case 'wav':
					return 'arraybuffer';
			case 'png':
			case 'jpg':
			case 'bmp':
			case 'gif':
			case 'jpeg':
					return 'blob';
			case 'json':
					return 'json';
			default:
					return 'text';
		}
	}

	public getMimeType(): string {
		switch (this._extension) {
			case 'ogg':
					return 'audio/vorbis';
			case 'wav':
					return 'audio/wave';
			case 'webm':
					return 'audio/webm';
			case 'png':
					return 'image/png';
			case 'jpg':
					return 'image/jpg';
			case 'bmp':
					return 'image/bmp';
			case 'gif':
					return 'image/gif';
			case 'jpeg':
					return 'image/jpeg';
			case 'json':
					return 'application/json';
			default:
					return '';
		}
	}
}
