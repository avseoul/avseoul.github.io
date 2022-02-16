import SkinToTextureMap from "../ThreeExtension/SkinToTextureMap";
import { Group, SkinnedMesh, Texture, Vector3 } from "three";
import { ParticleAmount } from "../Enum";
export default class ParticleSystem extends Group {
    private _material;
    private _mesh;
    private _geometry;
    private _bufferGeometry;
    private _behaviorBufferHandler;
    private _behaviorBuffers;
    private _bufferIndex;
    private _isInit;
    private get _currentBehaviorBuffer();
    private get _previousBehaviorBuffer();
    private _skinReference;
    get skinMap(): Texture;
    private _particleAmount;
    get particleAmount(): ParticleAmount;
    set particleAmount(value: ParticleAmount);
    constructor(meshReference: SkinnedMesh, skinReference: SkinToTextureMap);
    update(animationFrame: number): void;
    setFluorescentColor(enabled: boolean, shuffledIndex: Vector3): void;
    resetBuffers(): void;
    private getGeomSize;
    private setupTextureFormat;
}
