import Parser from './parser';
import Resource from '../resources/resource';
import Loader from '../loader';
import ResourceManager from '../resources/resource-manager';
import AudioManager from '../resources/audio/audio-manager';
export default class AudioParser extends Parser {
	public canParse(resource :Resource): boolean {
		return /(mp3|ogg|webm|m4a|aac|wav)$/.test(resource.extension);
	}
	public parse(resource: Resource): Promise<{}> {
		const data = resource.getData<ArrayBuffer>();
		return this.decode(data)
			.then((buffer: AudioBuffer) => {
					AudioManager.addBuffer(resource.name, buffer);
					return {};
			});
	}

	private decode(buffer: ArrayBuffer): Promise<{}> {
		if (!AudioManager.isSupported()) {
			return new Promise((resolve) => {
					resolve();
			});
		}
		return AudioManager.context.decodeAudioData(buffer);
	}
}
Loader.addParser(new AudioParser());
