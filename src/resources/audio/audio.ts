import AudioDescription from './audio-description';
import AudioManager from './audio-manager';

export interface AudioTemplate {
    name: string;
    useGainNode?: boolean;
}
export default class Audio {
    private _description: AudioDescription;
    private _sources: AudioBufferSourceNode[];
    private _buffer: AudioBuffer;
    private _destination: GainNode;
    constructor(template: AudioTemplate) {
        const description = AudioManager.getDescription(template.name);
        if (!description) {
             return;
        }
        const buffer = AudioManager.getBuffer(description.buffer);
        if (!buffer) {
            return;
        }
        if (template.useGainNode) {
            this._destination = AudioManager.context.createGain();
            this._destination.connect(AudioManager.destination);
        }
        else {
            this._destination = AudioManager.destination;
        }
        this._description = description;

        this._sources = [];
        this._buffer = buffer;
    }

    public play() {
        this._play().then((e) => {
            this._destroy(e);
        });
    }

    private _play(): Promise<Event> {
        const source = AudioManager.getSource();
        source.buffer = this._buffer;
        source.connect(this._destination);
        this._sources.push(source);
        const when: number = 0;
        const offset: number = this._description.start;
        const duration: number = this._description.end;

        return new Promise((resolve) => {
             source.onended = resolve;
             source.start(when, offset, duration);
        });
    }
    private _destroy(e: Event) {
        const source = e.target as AudioBufferSourceNode;
        const index = this._sources.indexOf(source);
        if (index > -1) {
            this._sources.slice(index, 1);
        }
    }
}
