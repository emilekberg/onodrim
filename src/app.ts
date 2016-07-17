import Entity from './entity';
import GameObject from './game-object';
import RenderComponent from './components/render-component'
import TransformComponent from './components/transform-component'
import SpriteComponent from './components/sprite-component'
import GraphicsComponent from './components/graphics-component'
import Texture from './resources/texture'
import Core from './core'
import ResourceManager from './resources/resource-manager'


ResourceManager.loadImages([
    'assets/star.png',
    'assets/SlimeA.png'
]).then((value) => {
    let core = new Core();
    let entity = new GameObject();
    let sprite = new SpriteComponent(entity);
    entity.addComponent(sprite);
    sprite.setTexture(new Texture(value[0].url));
    sprite.alpha = 1;
    let entity2 = new GameObject();
    entity.transform.addChild(entity2.transform);
    let sprite2 = new SpriteComponent(entity2);
    entity2.addComponent(sprite2);
    sprite2.setTexture(new Texture(value[1].url));
    sprite2.alpha = 1;
    core.start();

});

