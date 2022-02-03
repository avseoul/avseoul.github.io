export default class AnimationFrame {
    private _time;
    get time(): number;
    private _delta;
    get delta(): number;
    private _normalizeTimeScale;
    private get _timeScale();
    get timeScale(): number;
    private _prevTime;
    constructor();
    update(elapsedTime: number): void;
    setTimeSclae(value: number): void;
}
