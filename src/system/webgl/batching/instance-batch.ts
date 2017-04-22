import RenderBatch, { IAttribute } from './render-batch';

export default class InstanceBatch extends RenderBatch {
	protected _staticAttrib: IAttribute[];
	protected _instanceAttrib: IAttribute[];

	protected _instanceBuffer: WebGLBuffer|null;
	protected _instanceArrayBuffer: ArrayBuffer;
	protected _instanceBufferView: Float32Array;
	protected _instanceBufferSize: number;

	protected _indexBuffer: WebGLBuffer|null;
	constructor(gl: WebGL2RenderingContext, program:WebGLProgram, size: number) {
		super(gl, program, size);
		this._indexBuffer = null;
	}

	protected createBuffers() {
		const gl = this._gl;
		this._instanceBuffer = gl.createBuffer();

		const totalInstanceBufferSize = Float32Array.BYTES_PER_ELEMENT * this._instanceBufferSize * this._batchSize;
		this._instanceArrayBuffer = new ArrayBuffer(totalInstanceBufferSize);
		this._instanceBufferView = new Float32Array(this._instanceArrayBuffer);
	}

	protected initVAO() {
		const gl = this._gl;
		gl.bindVertexArray(this._vao);
		{   // used to make the scope of the vertex array a bit more clear
			this._staticAttrib.forEach((a) => {
					if (!a.buffer) {
						return;
					}
					gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
					gl.bufferData(gl.ARRAY_BUFFER, a.data as Float32Array, gl.STATIC_DRAW);

					gl.enableVertexAttribArray(a.index);
					gl.vertexAttribPointer(a.index, a.size, a.type, a.normalized, a.stride, a.offset);
					gl.vertexAttribDivisor(a.index, a.divisor);
			});

			// Store the offset between each packed vertex attribute
			let offset = 0;
			// Calculate and store the total stride for the instance data.
			const totalStride = this._instanceAttrib.reduce((a, b) => {
					return a + b.stride;
			}, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._instanceBuffer);
			this._instanceAttrib.forEach((a) => {
					for(let i = 0; i < a.length; i++) {
						gl.enableVertexAttribArray(a.index + i);
					}
					for(let i = 0; i < a.length; i++) {
						const currentOffset = offset + (a.offset * i);
						gl.vertexAttribPointer(a.index + i, a.size, a.type, a.normalized, totalStride, currentOffset);
					}
					for(let i = 0; i < a.length; i++) {
						gl.vertexAttribDivisor(a.index + i, a.divisor);
					}
					offset += a.stride;
			});

			if (this._indexBuffer) {
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
			}
		}
		gl.bindVertexArray(null);

		gl.bindBuffer(gl.ARRAY_BUFFER, this._instanceBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._instanceArrayBuffer, gl.DYNAMIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	/**
	 * flushes the batched objects and renders them into the backbuffer.
	 */
	protected flush() {
		const gl = this._gl as WebGL2RenderingContext;
		if (this._count === 0) {
			return;
		}

		gl.bindVertexArray(this._vao);
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this._instanceBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._instanceBufferView, 0, 0);
			gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this._count);
		}

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		if(this._count === this._batchSize && this._count < this._maxBatchSize) {
			this.createLargerBuffer();
		}
		this._count = 0;
	}

	protected createLargerBuffer() {
		this._batchSize *= 2;

		const totalInstanceBufferSize = Float32Array.BYTES_PER_ELEMENT * this._instanceBufferSize * this._batchSize;
		const old = this._instanceBufferView;
		this._instanceArrayBuffer = new ArrayBuffer(totalInstanceBufferSize);
		this._instanceBufferView = new Float32Array(this._instanceArrayBuffer);
		this._instanceBufferView.set(old);

		const gl = this._gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._instanceBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._instanceArrayBuffer, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	protected public() {
		const gl = this._gl;
	}
}
