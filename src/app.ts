import Entity from './entity';
import GameObject from './game-object';
import RenderComponent from './components/render-component'
import TransformComponent from './components/transform-component'
import SpriteComponent from './components/sprite-component'
import GraphicsComponent from './components/graphics-component'
import Texture from './resources/texture'
import Core from './core'


var core = new Core();
var entity = new GameObject();
entity.addComponent(new TransformComponent(entity));
let sprite = new SpriteComponent(entity);
entity.addComponent(sprite);
let texture = new Texture('assets/star.png');
sprite.setTexture(texture);
texture.load().then(() => {
    core.start();
});
