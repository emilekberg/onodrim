/**
 * TODO: This file may need to be cleaned up.
 * - Not sure if static attribs needs to be contained within lists, they can probably just be declared trhen ignored.
 * - Some magic values needs to be calculated, like offsets in add().
 */
import {Rect, Matrix3} from '../../../math';
import Texture from '../../../resources/texture';
import Color from '../../../graphics/color';
import { IAttribute } from '../batching/render-batch';
import InstanceBatch from '../batching/instance-batch';

export default class SpriteBatch extends InstanceBatch {
	protected _currentTexture:Texture;

	// look into https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
	constructor(gl:WebGL2RenderingContext, program:WebGLProgram, startBatchSize:number = 1) {
		super(gl, program, 256);

		const floatsPerColor = 4;
		const floatsPerQuad = 4;
		const floatsPerMatrix = 3 * 3;
		this._instanceBufferSize = floatsPerColor + floatsPerQuad + floatsPerMatrix;
	}

	/**
	 * Prepares a object to be rendered with supplied data.
	 * @param matrix Render matrix for the object to be rendered.
	 * @param texture Render texture for the object to be rendered.
	 * @param texCoord Texture quad for the object to be rendered.
	 * @param color Tinting and alpha for the object to be rendered.
	 */
	public render(matrix:Matrix3, texture: Texture, texCoord:Rect,color:Color): void {
		if (!this.canRenderTexture(texture) || this._count === this._batchSize) {
			this.flush();
		}
		this._currentTexture = texture;

		const offset = this._instanceBufferSize * this._count;
		const data = this._instanceBufferView;
		data[offset] = matrix.values[0];
		data[offset+1] = matrix.values[1];
		data[offset+2] = matrix.values[2];
		data[offset+3] = matrix.values[3];
		data[offset+4] = matrix.values[4];
		data[offset+5] = matrix.values[5];
		data[offset+6] = matrix.values[6];
		data[offset+7] = matrix.values[7];
		data[offset+8] = matrix.values[8];

		data[offset+9] = texCoord.array[0];
		data[offset+10] = texCoord.array[1];
		data[offset+11] = texCoord.array[2];
		data[offset+12] = texCoord.array[3];

		data[offset+13] = color.array[0];
		data[offset+14] = color.array[1];
		data[offset+15] = color.array[2];
		data[offset+16] = color.array[3];
		++this._count;
	}

	/**
	 * Creates buffers and prepares a VAO for the object to be rendered.
	 * TODO: This should be broken down into a instance-batch superclass instead.
	 *  Basically this instance of the function should only prepare the buffers and attributes.
	 *  Not setup the VAO.
	 * This might be largest function in the world.
	 */
	protected createBuffers() {
		super.createBuffers();
		const gl = this._gl as WebGL2RenderingContext;
		this._indexBuffer = gl.createBuffer();
		const indexData = new Uint8Array([
			0, 1, 2,
			0, 2, 3
		]);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

		this._staticAttrib = [
			{
				data: new Int8Array([
					-1, -1,
					-1, 1,
					1, 1,
					1, -1
				]),
				buffer: gl.createBuffer(),
				index: gl.getAttribLocation(this._program, 'vertex'),
				size: 2,
				type: gl.BYTE,
				normalized: false,
				stride: 0,
				offset: 0,
				length: 1,
				divisor: 0
			},
			{
				data: new Uint8Array([
					0, 0,
					0, 1,
					1, 1,
					1, 0
				]),
				buffer: gl.createBuffer(),
				index: gl.getAttribLocation(this._program, 'texCoord'),
				size: 2,
				type: gl.UNSIGNED_BYTE,
				normalized: false,
				stride: 0,
				offset: 0,
				length: 1,
				divisor: 0
			}
		];
		this._instanceAttrib = [
			{
				index: gl.getAttribLocation(this._program, 'instanceMatrix'),
				size: 3,
				type: gl.FLOAT,
				normalized: false,
				stride: 36,
				offset: 12,
				length: 3,
				divisor: 1
			},
			{
				index: gl.getAttribLocation(this._program, 'instanceTextureQuad'),
				size: 4,
				type: gl.FLOAT,
				normalized: false,
				stride: 16,
				offset: 16,
				length: 1,
				divisor: 1
			},
			{
				index: gl.getAttribLocation(this._program, 'instanceColor'),
				size: 4,
				type: gl.FLOAT,
				normalized: false,
				stride: 16,
				offset: 16,
				length: 1,
				divisor: 1
			}
		];

	}

	/**
	 * flushes the batched objects and renders them into the backbuffer.
	 */
	protected flush() {
		const gl = this._gl as WebGL2RenderingContext;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this._currentTexture.glTexture);
		super.flush();
	}

	/**
	 * returns true if the texture is of the same type as the previous one.
	 * @param texture
	 */
	private canRenderTexture(texture: Texture): boolean {
		return this._currentTexture === undefined || (this._currentTexture.url === texture.url);
	}
}
