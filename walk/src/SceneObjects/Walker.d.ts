import { SkinnedMesh } from "three";
export default class Walker {
    private _gltf;
    private _mixer;
    private _skinnedMeshes;
    private _glitchMaxEnabled;
    get scene(): import("three").Group;
    get skinnedMeshes(): SkinnedMesh<import("three").BufferGeometry, import("three").Material | import("three").Material[]>[];
    private _normalMapEnabled;
    get normalMapEnabled(): boolean;
    set normalMapEnabled(value: boolean);
    constructor(radius?: number, resolution?: number);
    update(time: number, delta: number): void;
    setGlitchEnabled(enabled: boolean): void;
    private setNormalMapEnabled;
}
