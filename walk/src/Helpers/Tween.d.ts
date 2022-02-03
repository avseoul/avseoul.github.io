export default class Tween {
    private _from;
    private _to;
    private _speed;
    private _epsilon;
    private _value;
    get value(): number;
    private _isDone;
    get isDone(): boolean;
    private _onBeginEvent;
    private _onUpdateEvent;
    private _onEndEvent;
    private _onBegin;
    get onBegin(): EventTarget;
    private _onUpdate;
    get onUpdate(): EventTarget;
    private _onEnd;
    get onEnd(): EventTarget;
    constructor(from?: number, to?: number, speed?: number, epsilon?: number);
    setFrom(value: number, needRestart?: boolean): void;
    setTo(value: number, needRestart?: boolean): void;
    setFromTo(from: number, to: number, needRestart?: boolean): void;
    begin(): void;
    end(): void;
    update(): void;
}
