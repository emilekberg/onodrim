import Random from './random';
export default class Range {
	protected _min: number;
	protected _max: number;
	constructor(min: number, max: number) {
		this._min = min;
		this._max = max;
	}

	get min(): number {
		return this._min;
	}

	get max(): number {
		return this._max;
	}

	get random(): number {
		return Random.int(this._min, this._max);
	}
}
