import { SkinnedMesh, Texture, WebGLMultipleRenderTargets } from "three";
export default class SkinToTextureMap extends WebGLMultipleRenderTargets {
    private _source;
    private _rttHandler;
    private _count;
    get count(): number;
    get positionTexture(): Texture;
    get normalTexture(): Texture;
    constructor(source: SkinnedMesh);
    update(): void;
}
