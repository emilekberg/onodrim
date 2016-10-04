"use strict";
//Onodrim.Resources.
//var game = new Onodrim.Core(false);
/*
import GameObject from 'game-object';
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

import Particle from './graphics/particle'
import ParticleSystem from './graphics/particle-system'
import ParticleComponent from './graphics/particle-component'
import Time from './time'

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
        //this.addEntity(entity);

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
        //this.addEntity(entity);
        
        let entity2 = new GameObject();
        //entity2.addComponent(new TransformComponent(entity2));
        let sprite2 = AnimationComponent.CreateFromRect(entity2,{
            texture: new Texture('assets/SlimeA.png'),
            autoStart: true,
            fps: 24
        }, new Rect(0, 0, 16, 16));
        entity2.addComponent(sprite2);
        sprite2.offset = new Point(0.5, 0.5);
        //this.addEntity(entity);
        //this.addEntity(entity2);
        entity2.getComponent(TransformComponent).x = 400;
        entity2.getComponent(TransformComponent).y = 100;
        //entity.transform.addChild(entity2.getComponent(TransformComponent));

        let entity3 = new Entity();
        entity3.addComponent(new TransformComponent(entity3));
        entity3.addComponent(new ParticleComponent(entity3, {
            system:new ImplParticleSystem()
        }));
        this.addEntity(entity3);
        entity3.getComponent(ParticleComponent).system.start();
        //let ps = new ImplParticleSystem();
        //this.addEntity(ps);
        //ps.start();
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
    core = new Core(true);
    scene = new MyScene();
    Scene.ChangeScene(scene);
    core.start();
});


const FireRate = 0.25;
class ImplParticleSystem extends ParticleSystem {
    private _timer: number;
    public delta:number;
    private _particlesLeft:number;
    constructor() {
        super();
        this._particlesLeft = 100000;
        this._timer = 0;
    }

    protected _shouldFireParticle() {
        return this._timer >= FireRate && this._particlesLeft > 0;
    }
    protected _fireParticle() {
        super._fireParticle();
        this._timer-=FireRate;
        this._particlesLeft--;
        
    }
    fixedUpdate() {
        super.fixedUpdate();
        this._timer += Time.deltaTime;
    }
    
    protected _shouldStop():boolean {
        return this._particlesLeft <= 0;
    }

    protected _setParticleType() {
        this._particleConstructor = ImplParticle;
    }
}

const LifeTime = 2;
class ImplParticle extends Particle {
    velocity: Point;
    time: number;
    sprite:SpriteComponent;
    constructor() {
        super();
        this.sprite = this.renderComponent as SpriteComponent;
        this.sprite.setTexture(new Texture('assets/square.png'))
        this.sprite.offset.x = this.sprite.offset.y = 0.5;
        this.transform.scale = new Point(0.025, 0.025);
        this.velocity = new Point();
    }

    public init(owner: ParticleSystem) {
        super.init(owner);
        
        var rand = (Math.random()*7) | 0;
        var dir = (Math.random()*Math.PI*2);
        this.velocity.x = Math.cos(dir);
        this.velocity.y = Math.sin(dir);
        this.time = 0;

    }
    fixedUpdate(): boolean {
        this.transform.x += this.velocity.x;
        this.transform.y += this.velocity.y;
        this.velocity.y += 0.01;
        this.time += Time.deltaTime
        this.sprite.alpha = 1 - (this.time / LifeTime);
        return super.fixedUpdate();
    }

    protected _isAlive(): boolean {
        return (this.time < LifeTime)
    }
}
*/ 
