import { Color, Mesh } from "three";
export default class Floor extends Mesh {
    private _plannarReflectionHandler;
    private _normalMapEnabled;
    get normalMapEnabled(): boolean;
    set normalMapEnabled(value: boolean);
    private _plannarReflectionEnabled;
    get plannarReflectionEnabled(): boolean;
    set plannarReflectionEnabled(value: boolean);
    constructor(size: number, segments: number);
    update(animationFrame: number): void;
    setCustomSlider(value: number): void;
    setTimeScale(value: number): void;
    setColor(value: Color): void;
    private setNormalMapEnabled;
    private setPlannarReflectionEnabled;
}
