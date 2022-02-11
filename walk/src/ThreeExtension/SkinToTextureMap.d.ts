import { SkinnedMesh, Texture, WebGLMultipleRenderTargets } from "three";
export default class SkinToTextureMap extends WebGLMultipleRenderTargets {
    private _reference;
    private _rttHandler;
    private _isBoneTextureAvailable;
    private _usedSlotCount;
    /**
        Map size is larger than the actual vertices due to keep pow of 2 size
    */
    get usedSlotCount(): number;
    private _length;
    get length(): number;
    private _size;
    get size(): number;
    get positionTexture(): Texture;
    get normalTexture(): Texture;
    get tangentTexture(): Texture;
    constructor(reference: SkinnedMesh, skinToTextureInitCallback: (ref: SkinToTextureMap) => any);
    updateUniforms(): void;
    update(): void;
}
