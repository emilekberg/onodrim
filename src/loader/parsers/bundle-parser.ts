import Parser from './parser';
import Resource from '../resource';
import Loader from '../loader';
export interface Bundle {
	bundle: Asset[];
}
export interface Asset {
	name: string;
	url: string;
	data?: Asset|Blob|ArrayBuffer;
}
export default class BundleParser extends Parser {
	public canParse(resource: Resource): boolean {
		const isJSON = /json$/.test(resource.extension);
		const isBundle = resource.getData<{}>().hasOwnProperty('bundle');
		return isJSON && isBundle;
	}
	public parse(resource: Resource): Promise<{}> {
		const data = resource.getData<Bundle>();
		data.bundle.forEach((asset) => {
			if (asset.data) {
				const url = this.formatUrl(resource.url, asset.url);
				console.warn('BundleParser.parse  - Asset.data not yet implemented');
			}
			else {
				const url = this.formatUrl(resource.url, asset.url);
				Loader.add(url, asset.name);
			}
		});
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	private formatUrl(baseUrl: string, relativeUrl: string): string {
		return baseUrl.substring(0, baseUrl.lastIndexOf('/')+1) + relativeUrl;
	}
}
Loader.addParser(new BundleParser());
