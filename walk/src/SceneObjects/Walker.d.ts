import { SkinnedMesh } from "three";
export default class Walker {
    private _gltf;
    private _mixer;
    private _skinnedMeshes;
    get scene(): import("three").Group;
    get skinnedMeshes(): SkinnedMesh<import("three").BufferGeometry, import("three").Material | import("three").Material[]>[];
    private _tangentEnabled;
    get tangentEnabled(): boolean;
    set tangentEnabled(value: boolean);
    constructor(radius?: number, resolution?: number);
    update(time: number, delta: number): void;
    setTimeScale(value: number): void;
    private setTangentEnabled;
}
