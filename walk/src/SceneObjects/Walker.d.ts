import { SkinnedMesh } from "three";
export default class Walker {
    private _gltf;
    private _mixer;
    private _materials;
    private _skinnedMeshes;
    get scene(): import("three").Group;
    get skinnedMeshes(): SkinnedMesh<import("three").BufferGeometry, import("three").Material | import("three").Material[]>[];
    constructor(radius?: number, resolution?: number);
    update(time: number, delta: number): void;
    shuffleColor(): void;
}
