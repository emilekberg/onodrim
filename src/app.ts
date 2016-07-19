import Entity from './entity';
import GameObject from './game-object';
import RenderComponent from './components/render-component'
import TransformComponent from './components/transform-component'
import SpriteComponent from './components/sprite-component'
import GraphicsComponent from './components/graphics-component'
import Texture from './resources/texture'
import Core from './core'
import ResourceManager from './resources/resource-manager'
import Point from './math/point'

import Scene from './scene'


export default class MyScene extends Scene {
    constructor() {
        super();
        let entity = new GameObject();
        let sprite = new SpriteComponent(entity);
        entity.addComponent(sprite);
        sprite.setTexture(new Texture('assets/star.png'));
        sprite.alpha = 1;
        //entity.transform.origo.x = sprite.width * 0.5;
        //entity.transform.origo.y = sprite.height * 0.5;
        entity.transform.x = 400;
        entity.transform.y = 300;
        sprite.offset = new Point(0.5, 0.5);
        let entity2 = new Entity();
        entity2.addComponent(new TransformComponent(entity2));
        let sprite2 = new SpriteComponent(entity2);
        entity2.addComponent(sprite2);
        sprite2.setTexture(new Texture('assets/square.png'));
        sprite2.alpha = 1;
        //entity2.getComponent(TransformComponent).x = 400;
        //entity2.getComponent(TransformComponent).y = 300;
        
        sprite2.texture.rect.w = 64;
        sprite2.offset = new Point(0.5, 0.5);
        this.addEntity(entity);
        this.addEntity(entity2);
        entity.transform.addChild(entity2.getComponent(TransformComponent));
    }
}
ResourceManager.loadImages([
    'assets/star.png',
    'assets/SlimeA.png',
    'assets/square.png'
]).then((value) => {
    let core = new Core();
    let scene = new MyScene();
    Scene.ChangeScene(scene);
    core.start();
});

