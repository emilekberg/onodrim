import Parser from './parser';
import Resource from '../resource';
import Loader from '../loader';
import AudioManager from '../../resources/audio/audio-manager';
import AudioDescription, {IAudioDescription} from '../../resources/audio/audio-description';
export interface AudioJson {
	audio: {
		name: string;
		url: string;
		description: IAudioDescription;
	};
}
export default class AudioDescriptionParser extends Parser {
	public canParse(resource: Resource): boolean {
		const isJSON = /json$/.test(resource.extension);
		const isBundle = resource.getData<{}>().hasOwnProperty('audio');
		return isJSON && isBundle;
	}
	public parse(resource: Resource): Promise<{}> {
		const data = resource.getData<AudioJson>().audio;
		const description = new AudioDescription(data.description);
		AudioManager.addDescription(data.description.name, description);
		return new Promise((resolve, reject) => {
			const url = this.formatUrl(resource.url, data.url);
			Loader.add(url, data.name);
			resolve();
		});
	}
	private formatUrl(baseUrl: string, relativeUrl: string): string {
		return baseUrl.substring(0, baseUrl.lastIndexOf('/')+1) + relativeUrl;
	}
}
Loader.addParser(new AudioDescriptionParser());
