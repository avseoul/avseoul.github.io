import { SkinnedMesh, Texture, WebGLMultipleRenderTargets } from "three";
export default class SkinToTextureMap extends WebGLMultipleRenderTargets {
    private _source;
    private _rttHandler;
    private _count;
    get count(): number;
    private _length;
    get length(): number;
    get positionTexture(): Texture;
    get normalTexture(): Texture;
    get tangentTexture(): Texture;
    constructor(source: SkinnedMesh);
    updateUniforms(): void;
    update(): void;
}
