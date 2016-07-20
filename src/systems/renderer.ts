import WebGLRenderer from './webgl-renderer';
import CanvasRenderer from './canvas-renderer'
import RenderComponent from '../components/render-component'
export interface RendererSystem {
    render(delta:number):void;
}
export default class Renderer {
    static createRenderer():RendererSystem {
        if (this.isWebGLSupported()) {
            return new WebGLRenderer();
        }
        return new CanvasRenderer();
    }
    static createCanvasRenderer():CanvasRenderer {
        return new CanvasRenderer();
    }
    static createWebGLRenderer():WebGLRenderer {
        return new WebGLRenderer();
    }
    static isWebGLSupported() {
        try{
            var canvas = document.createElement( 'canvas' ); 
            let WebGLRenderingContextExist = !!WebGLRenderingContext;
            let WebGLContextExistsInCanvas = !!canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return  WebGLRenderingContextExist && WebGLContextExistsInCanvas;
        }
        catch(e) { 
            return false; 
        } 
    }

    static Renderers:Array<RenderComponent> = [];
}