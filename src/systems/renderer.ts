import Scene from "../scene";
import SpriteComponent from "../components/sprite-component";
import RenderComponent from "../components/render-component";

export default class Renderer {
    public static RENDER_COMPONENTS:Array<RenderComponent> = [];
    public static GL:WebGLRenderingContext = null;
    public static PROGRAM:WebGLProgram = null;
    public static isWebGLSupported() {
        try{
            let canvas = document.createElement("canvas");
            let webGLRenderingContextExist = !!WebGLRenderingContext;
            let webGLContextExistsInCanvas = !!canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            return webGLRenderingContextExist && webGLContextExistsInCanvas;
        }
        catch(e) {
            return false;
        }
    }
    public static loadShader(url:string, gl:WebGLRenderingContext):WebGLShader {
        let source = this._requestShaderSync(url);
        let shader:WebGLShader;
        if (url.indexOf(".frag") !== -1) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (url.indexOf(".vert") !== -1) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
            return null;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("error while compiling the shader:", gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    public static _requestShaderSync(path: string):string {
        let request = new XMLHttpRequest();
        request.open("GET", path, false);
        request.overrideMimeType("charset=utf-8");
        request.send();
        return request.response;
    }

    public gl:WebGLRenderingContext;
    public canvas:HTMLCanvasElement;
    public width:number;
    public height:number;

    public shaderProgram:WebGLProgram;

    constructor() {
        this.width = 800;
        this.height = 300;
        this.initGL();
        this.initShaders();
        this.initDefaultBuffers();
        document.body.appendChild(this.canvas);
    }
    public initGL() {
        let canvas = this.canvas = document.createElement("Canvas") as HTMLCanvasElement;
        let opts:WebGLContextAttributes = {
            premultipliedAlpha: false,
            alpha: false,
            antialias: true
        };
        let gl = this.canvas.getContext("webgl", opts) || this.canvas.getContext("experimental-webgl", opts);
        Renderer.GL = this.gl = gl;
        canvas.width = this.width;
        canvas.height = this.height;
        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable( gl.BLEND );
        gl.blendEquation( gl.FUNC_ADD );
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, this.width, this.height);
    }

    public initShaders() {
        let gl = this.gl;
        let fragShader = Renderer.loadShader("./shaders/sprite.frag", gl);
        let vertShader = Renderer.loadShader("./shaders/sprite.vert", gl);
        let program = this.shaderProgram = Renderer.PROGRAM = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Unable to initialize the shader program:" + gl.getProgramInfoLog(program));
        }
        gl.useProgram(program);

        let resolutionLocation = gl.getUniformLocation(this.shaderProgram, "u_resolution");
        gl.uniform2f(resolutionLocation, this.width, this.height);
    }

    public initDefaultBuffers() {
        let gl = this.gl;

        SpriteComponent.vertexLocation = gl.getAttribLocation(this.shaderProgram, "a_position");
        SpriteComponent.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteComponent.vertexBuffer );
        gl.enableVertexAttribArray(SpriteComponent.vertexLocation);
        gl.vertexAttribPointer(SpriteComponent.vertexLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1
        ]), gl.STATIC_DRAW);

        SpriteComponent.texCoordLocation = gl.getAttribLocation(this.shaderProgram, "a_texCoord");
        SpriteComponent.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteComponent.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0
        ]), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(SpriteComponent.texCoordLocation);
        gl.vertexAttribPointer(SpriteComponent.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    }

    public setGLRectangle(gl:WebGLRenderingContext, x:number, y:number, width:number, height:number) {
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

    public render(delta) {
        let resort = false;
        let gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteComponent.vertexBuffer);
        gl.vertexAttribPointer(SpriteComponent.vertexLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteComponent.texCoordBuffer);
        gl.vertexAttribPointer(SpriteComponent.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        for(let i = 0; i < Scene.CURRENT_SCENE.renderers.length; i++) {
            let renderer = Scene.CURRENT_SCENE.renderers[i];
            if(renderer) {
                if(renderer.requireDepthSort && !resort) {
                    resort = true;
                }
                renderer.render(delta, gl);
            }
        }
        gl.flush();
        if(resort) {
             Scene.CURRENT_SCENE.renderers.sort((a, b) => {
                 if(a.depth > b.depth) {
                     return 1;
                 }
                 if(a.depth < b.depth) {
                     return -1;
                 }
                 return 0;
             });
        }
    }
}
