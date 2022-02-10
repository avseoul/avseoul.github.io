import { Mesh } from "three";
export default class Floor extends Mesh {
    private _tangentEnabled;
    get tangentEnabled(): boolean;
    set tangentEnabled(value: boolean);
    constructor(size: number, segments: number);
    update(animationFrame: number): void;
    setCustomSlider(value: number): void;
    setTimeScale(value: number): void;
    private setTangentEnabled;
}
