import Entity from './entity';
import GameObject from './game-object';
import RenderComponent from './components/render-component'
import TransformComponent from './components/transform-component'
import GraphicsComponent from './components/graphics-component'
import Core from './core'


var core = new Core();
var entity = new GameObject();
entity.addComponent(new TransformComponent(entity));
entity.addComponent(new GraphicsComponent(entity));
var g = entity.getComponent<GraphicsComponent>(GraphicsComponent);
g.width = 10;
g.height = 200;

var entity2 = new GameObject();
entity2.addComponent(new TransformComponent(entity2));
entity2.addComponent(new GraphicsComponent(entity2));
var g2 = entity2.getComponent<GraphicsComponent>(GraphicsComponent);
g2.width =20;
g2.height = 20;
g2.color = 'rgb(0,200,0)';
entity.getComponent<TransformComponent>(TransformComponent).x = 100;

entity2.getComponent<TransformComponent>(TransformComponent).x = 0;
entity2.getComponent<TransformComponent>(TransformComponent).y = 0;
//entity.getComponent<TransformComponent>(TransformComponent).addChild(entity2.getComponent<TransformComponent>(TransformComponent));
core.start();