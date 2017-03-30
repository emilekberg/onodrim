export interface IAudioDescription {
    readonly name: string;
    readonly buffer: string;
    readonly start: number;
    readonly end: number;
    readonly duration: number;
    readonly loopStart: number;
    readonly loopEnd: number;
    readonly loopDuration: number;
}
export default class AudioDescription implements IAudioDescription {
    public readonly name: string;
    public readonly buffer: string;
    public readonly start: number;
    public readonly end: number;
    public readonly duration: number;
    public readonly loopStart: number;
    public readonly loopEnd: number;
    public readonly loopDuration: number;

    constructor(description: IAudioDescription) {
        this.name = description.name;
        this.buffer = description.buffer;
        this.start = description.start;
        this.end = description.end;
        this.duration = this.end - this.start;
        this.loopStart = description.loopStart || this.start;
        this.loopEnd = description.loopEnd || this.end;
        this.loopDuration = this.loopEnd - this.loopStart;
    }
};
