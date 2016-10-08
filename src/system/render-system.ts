import SpriteComponent from "../components/sprite-component";
import RenderComponent from "../components/render-component";
import SpriteFrag from "../../shaders/sprite.frag";
import SpriteVert from "../../shaders/sprite.vert";

export const enum ShaderType {
    Vert, Frag
}
export default class RenderSystem {
    public static SYSTEM_TYPE:string = "renderer";
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
    public static createShader(shaderSource:string, shaderType:ShaderType, gl:WebGLRenderingContext):WebGLShader {
        let shader:WebGLShader;
        if (shaderType === ShaderType.Frag) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (shaderType === ShaderType.Vert) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("error while compiling the shader:", gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    public gl:WebGLRenderingContext;
    public canvas:HTMLCanvasElement;
    public width:number;
    public height:number;
    public systemType:string;
    public shaderProgram:WebGLProgram;
    protected _renderComponents: Array<RenderComponent>;
    constructor() {
        this.systemType = RenderSystem.SYSTEM_TYPE;
        this.width = 800;
        this.height = 300;
        this.initGL();
        this.initShaders();
        this.initDefaultBuffers();
        this._renderComponents = [];
        document.body.appendChild(this.canvas);
    }

    public addComponentInstance(component:RenderComponent):void {
        this._renderComponents.push(component);
    }
    public removeComponentInstance(component:RenderComponent):void {
        let index = this._renderComponents.indexOf(component);
        if (index !== -1) {
            this._renderComponents.splice(index, 1);
        }
    }

    public initGL():void {
        let canvas = this.canvas = document.createElement("Canvas") as HTMLCanvasElement;
        let opts:WebGLContextAttributes = {
            premultipliedAlpha: false,
            alpha: false,
            antialias: true
        };
        let gl = this.canvas.getContext("webgl", opts) || this.canvas.getContext("experimental-webgl", opts);
        RenderSystem.GL = this.gl = gl;
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
        let fragShader = RenderSystem.createShader(SpriteFrag, ShaderType.Frag, gl);
        let vertShader = RenderSystem.createShader(SpriteVert, ShaderType.Vert, gl);
        let program = this.shaderProgram = RenderSystem.PROGRAM = gl.createProgram();
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

    public render(delta:number) {
        let resort = false;
        let gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteComponent.vertexBuffer);
        gl.vertexAttribPointer(SpriteComponent.vertexLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, SpriteComponent.texCoordBuffer);
        gl.vertexAttribPointer(SpriteComponent.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        for(let i = 0; i < this._renderComponents.length; i++) {
            let renderer = this._renderComponents[i];
            if(renderer /*&& renderer.getEntity().isInWorld()*/) {
                if(renderer.requireDepthSort && !resort) {
                    resort = true;
                }
                renderer.render(delta, gl);
            }
        }
        gl.flush();
        if(resort) {
             this._renderComponents.sort((a, b) => {
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
