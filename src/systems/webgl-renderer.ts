import {RendererSystem} from './renderer'
import Scene from '../scene'
import SpriteComponent from '../components/sprite-component'
import Texture from '../resources/texture'
export default class WebGLRenderer implements RendererSystem {
    static loadShader(url:string, gl:WebGLRenderingContext):WebGLShader {
        let source = this._requestShaderSync(url);
        let shader:WebGLShader;
        if (url.indexOf('.frag') !== -1) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (url.indexOf('.vert') !== -1) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
            return null;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('error while compiling the shader:', gl.getShaderInfoLog(shader));
            return null;    
        }
        return shader;
    }
    static _requestShaderSync(path: string):string {
            var request = new XMLHttpRequest();
            request.open('GET', path, false);
            request.overrideMimeType("charset=utf-8");
            
            request.send();
            return request.response;
        }

    
    gl:WebGLRenderingContext;
    canvas:HTMLCanvasElement;
    width:number;
    height:number;
    static gl:WebGLRenderingContext = null;
    static program:WebGLProgram = null;
    shaderProgram:WebGLProgram;


    texture:Texture;
    positionLocation:number;
    resolutionLocation:WebGLUniformLocation;
    vertexBuffer:WebGLBuffer;
    texCoordLocation:number;
    texCoordBuffer:WebGLBuffer;
    constructor() {
        this.width = 800;
        this.height = 300;
        
        this.initGL();
        this.initShaders();
        this.initDebugData();
        document.body.appendChild(this.canvas);
    }
    initGL() {
        let canvas = this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
        let gl = WebGLRenderer.gl = this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        canvas.width = this.width;
        canvas.height = this.height;
        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL); 
        gl.viewport(0, 0, this.width, this.height);       
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    initShaders() {
        let gl = this.gl;
        let fragShader = WebGLRenderer.loadShader('./shaders/sprite.frag', gl);
        let vertShader = WebGLRenderer.loadShader('./shaders/sprite.vert', gl);
        let program = this.shaderProgram = WebGLRenderer.program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program:' + gl.getProgramInfoLog(program));
        }
        gl.useProgram(program);
        
    }

    

    initDebugData() {
        let gl = this.gl;
        this.texture = new Texture('./assets/tile.png');
        this.positionLocation = gl.getAttribLocation(this.shaderProgram, 'a_position');
        this.texCoordLocation = gl.getAttribLocation(this.shaderProgram, 'a_texCoord');
        this.resolutionLocation = gl.getUniformLocation(this.shaderProgram, 'u_resolution');
        gl.uniform2f(this.resolutionLocation, this.width, this.height);

        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0
        ]), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(this.texCoordLocation);
        gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        
        

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

        this.setGLRectangle(gl, 0, 0, this.texture.rect.w, this.texture.rect.h);
        
    }

    setGLRectangle(gl:WebGLRenderingContext, x:number, y:number, width:number, height:number) {
        let x1 = x;
        let x2 = x+width;
        let y1 = y;
        let y2 = y+height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]), gl.STATIC_DRAW);
    }

    render(delta) {
        let gl = this.gl;
        gl.viewport(0, 0, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(let i = 0; i < Scene.CurrentScene.renderers.length; i++) {
            let renderer = Scene.CurrentScene.renderers[i];
            if(renderer) {
                renderer.renderWebGL(delta, gl);
            }
        }
        /*gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.glTexture);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);*/
        gl.flush();
    }

}