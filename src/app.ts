import Entity from './entity';
import GameObject from './game-object';
import RenderComponent from './components/render-component'
import TransformComponent from './components/transform-component'
import SpriteComponent from './components/sprite-component'
import AnimationComponent from './components/animation-component'
import GraphicsComponent from './components/graphics-component'
import Texture from './resources/texture'
import Core from './core'
import ResourceManager from './resources/resource-manager'
import Point from './math/point'

import Scene from './scene'
import Rect from './math/rect'


export default class MyScene extends Scene {
    constructor() {
        super();
        let entity = new GameObject();
        let sprite = new SpriteComponent(entity, {
            alpha: 1,
            offset: new Point(0.5, 0.5),
            x: 0,
            y: 0
        });
        entity.addComponent(sprite);
        sprite.setTexture(new Texture('assets/tile.png'), );
        entity.transform.x = 200;
        entity.transform.y = 10;
        this.addEntity(entity);

        entity = new GameObject();
        sprite = new SpriteComponent(entity, {
            alpha: 1,
            offset: new Point(0.5, 0.5),
            x: 0,
            y: 0,
            depth: -1
        });
        entity.addComponent(sprite);
        sprite.setTexture(new Texture('assets/square.png'), );
        entity.transform.x = 200;
        entity.transform.y = 0;
        entity.transform.scaleX = 0.5;
        entity.transform.scaleY = 0.5;
        this.addEntity(entity);
        
        let entity2 = new GameObject();
        //entity2.addComponent(new TransformComponent(entity2));
        let sprite2 = AnimationComponent.CreateFromRect(entity2,{
            texture: new Texture('assets/SlimeA.png'),
            autoStart: true,
            fps: 24
        }, new Rect(0, 0, 16, 16));
        entity2.addComponent(sprite2);
        sprite2.offset = new Point(0.5, 0.5);
        this.addEntity(entity);
        this.addEntity(entity2);
        entity2.getComponent(TransformComponent).x = 400;
        entity2.getComponent(TransformComponent).y = 100;
        //entity.transform.addChild(entity2.getComponent(TransformComponent));
    }
}
ResourceManager.loadImages([
    'assets/star.png',
    'assets/SlimeA.png',
    'assets/square.png',
    'assets/tile.png'
]).then((value) => {
    let core:Core;
    let scene:Scene;;
    ///*
    core = new Core(true);
    scene = new MyScene();
    Scene.ChangeScene(scene);
    core.start();//*/
    /*
    core = new Core(false);
    scene = new MyScene();
    Scene.ChangeScene(scene);
    core.start();//*/
});

