import Parser from './parser';
import Resource from '../resource';
import Loader from '../loader';
import ImageManager from '../../resources/image-manager';
export default class ImageParser extends Parser {
	private static FORMATS_REGEX = /(png|jpg|jpeg|bmp|gif)$/;
	public canParse(resource :Resource): boolean {
		return ImageParser.FORMATS_REGEX.test(resource.extension);
	}
	public parse(resource: Resource): Promise<{}> {
		const data = resource.getData<Blob>();
		const urlData = window.URL.createObjectURL(data);
		return ImageManager.loadImage(resource.name, urlData);
	}
}
Loader.addParser(new ImageParser());
