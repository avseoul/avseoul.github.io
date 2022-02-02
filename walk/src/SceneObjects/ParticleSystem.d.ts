import { Group, SkinnedMesh } from "three";
export default class ParticleSystem extends Group {
    private _material;
    private _behaviorBufferHandler;
    private _behaviorBuffers;
    private _bufferIndex;
    private _isInit;
    private get _currentBehaviorBuffer();
    private get _previousBehaviorBuffer();
    constructor(reference: SkinnedMesh);
    update(animationFrame: number): void;
    private setupTextureFormat;
}
