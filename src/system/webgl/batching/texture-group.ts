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
        let group = this.groups[this._current];
        if (this._current === -1 || group.texture.url !== texture.url) {
            this._current = this.getNextIndex(texture);
            group = this.groups[this._current];
            group.texture = texture;
            group.length = 0;
        }
        return group;
    }

    protected getNextIndex(texture: Texture): number {
        if (this._current === this.groups.length-1) {
            this.groups.push({
                texture,
                start: 0,
                length: 0
            });
        }
        return ++this._current;
    }
}
