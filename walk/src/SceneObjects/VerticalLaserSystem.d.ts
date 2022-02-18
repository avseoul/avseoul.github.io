import { Mesh } from "three";
export default class VerticalLaserSystem extends Mesh {
    private _behaviorHandler;
    private _behaviorBuffer;
    private _tween;
    get texture(): import("three").Texture;
    constructor(numLasers: number);
    update(time: number): void;
    triggerAnimation(): void;
    private setAnimType;
    private setOriginTargetHash;
    private setInterpolation;
    private computeBatchedGemo;
}
