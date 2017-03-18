export interface IAttribute {
    data?: Float32Array|Uint8Array|Int8Array;
    buffer?: WebGLBuffer|null;
    index: number;
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
    divisor: number;
    length: number;
}

export default class RenderBatch {
    protected _gl: WebGL2RenderingContext;
    protected _batchSize: number;
    protected readonly _maxBatchSize: number;
    protected _count: number;
    protected _program:WebGLProgram;

    protected _vao: WebGLVertexArrayObject;
    constructor(gl: WebGL2RenderingContext, program:WebGLProgram, size: number) {
        this._gl = gl;
        this._program = program;
        this._batchSize = size;
        this._maxBatchSize = size * 100;
        this._count = 0;
    }

    public init(): void {
        this.createVAO();
        this.createBuffers();
        this.initVAO();
    }

    public doFlush(): void {
        this.flush();
    }

    protected initVAO() {
        // stuff
    }

    protected createVAO() {
        const vao = this._gl.createVertexArray();
        if (!vao) {
           console.error('could not create VertexArrayObject');
           return;
        }
        this._vao = vao;
    }

    protected createBuffers(): void {
        // stuff
    }

    protected createLargerBuffers(): void {
        // stuff
    }

    protected flush(): void {
        // stuff
    }
}
