import ComponentFactory from './component-factory';
import Sprite, { SpriteTemplate } from './sprite';
import Entity from '../entity';
export interface TextTemplate extends SpriteTemplate {

}
export default class Text extends Sprite {
	protected _text: string;
	protected _width: number;
	protected _height: number;

	constructor(entity: Entity, template: TextTemplate) {
		// template.texture = new Texture();
		super(entity, template);
	}


}
ComponentFactory.register(Text, 'onodrim.text');
