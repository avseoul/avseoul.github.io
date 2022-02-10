import { Group, SkinnedMesh, Texture } from "three";
export default class ParticleSystem extends Group {
    private _material;
    private _behaviorBufferHandler;
    private _behaviorBuffers;
    private _bufferIndex;
    private _isInit;
    private get _currentBehaviorBuffer();
    private get _previousBehaviorBuffer();
    private _skinToMap;
    private _skinMap;
    get skinMap(): Texture;
    constructor(reference: SkinnedMesh);
    update(animationFrame: number): void;
    private setupTextureFormat;
}
