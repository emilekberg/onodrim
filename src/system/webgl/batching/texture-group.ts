import BatchGroup from './batch-group';
import Texture from '../../../resources/texture';
export default class TextureGroup {
    public readonly groups: BatchGroup[];
    private _current: number;
    public get currentIndex(): number {
        return this._current;
    }
    public get current():BatchGroup {
        return this.groups[this._current];
    }

    constructor() {
        this.groups = [];
        this._current = -1;
    }
    public reset() {
        this._current = -1;
    }

    public getGroup(texture:Texture) {
        if (this._current === -1 || this.groups[this._current].texture.url !== texture.url) {
            this._current = this.getNextIndex();
            this.groups[this._current].texture = texture;
            this.groups[this._current].length = 0;
        }
        return this.groups[this._current];
    }

    protected getNextIndex(): number {
        if (this._current === this.groups.length-1) {
            this.groups.push({texture: undefined, start: 0, length: 0});
        }
        return ++this._current;
    }
}
