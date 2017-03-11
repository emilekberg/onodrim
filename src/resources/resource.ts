export interface ResourceData {
    name: string;
    url: string;
}
export default class Resource {
    public get extension() {
        return this._extension;
    }
    public get url() {
        return this._url;
    }
    public get name() {
        return this._name;
    }
    private _url: string;
    private _name: string;
    private _data: any;
    private _mimeType: string;
    private _responseType: string;
    private _extension: string;
    constructor(data: ResourceData) {
        this._url = data.url;
        this._name = data.name;

        const result = /(?=.)\w*$/g.exec(this._url);
        if(result) {
            this._extension = result[0];
        }
        this._mimeType = this.getMimeType();
        this._responseType = this.getResponseType();
    }

    public load(): Promise<{}> {
        const request = new XMLHttpRequest();
        request.responseType = this._responseType;
        request.open('GET', this._url);

        return new Promise((resolve, reject) => {
            request.addEventListener('load', (e) => {
                this.onLoad(e);
                resolve();
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

    public getResponseType(): string {
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
                return '';
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
