import AudioDescription from './audio-description';

declare var webkitAudioContext: {
    new(): AudioContext
};
export class AudioManager {
    public get context(): AudioContext {
        return this._context;
    }
    public get destination(): GainNode {
        return this._masterGain;
    }
    protected _context: AudioContext;
    private _buffers: {[key:string]:AudioBuffer};
    private _descriptions: {[key: string]: AudioDescription};
    private _masterGain: GainNode;
    constructor() {
        if (!this.isSupported()) {
            return;
        }
        this._buffers = {};
        this._descriptions = {};
        this._context = new AudioContext();
        this._masterGain = this._context.createGain();
        this._masterGain.connect(this._context.destination);
    }

    public isSupported(): boolean {
        return (AudioContext || webkitAudioContext) !== undefined;
    }

    public addBuffer(name: string, buffer: AudioBuffer): void {
        if (!this._buffers[name]) {
            this._buffers[name] = buffer;
        }
    }

    public getBuffer(name: string): AudioBuffer|null {
        return this._buffers[name] || null;
    }

    public addDescription(name: string, description: AudioDescription) {
        this._descriptions[name] = description;
    }

    public getDescription(name: string): AudioDescription|null {
        return this._descriptions[name] || null;
    }

    public getSource(): AudioBufferSourceNode {
        const source = this._context.createBufferSource();
        return source;
    }
}
const instance = new AudioManager();
export default instance;
