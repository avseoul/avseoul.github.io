import { Matrix4, MeshPhysicalMaterial, Texture } from "three";
import PBRMaterialExtendedParameters from "./PBRMaterialExtendedParameters";
export default class PBRMaterialExtended extends MeshPhysicalMaterial {
    private _shader;
    constructor(materialParams: PBRMaterialExtendedParameters);
    set fresnel(value: number);
    set fresnelPower(value: number);
    set totalElapsedTime(value: number);
    set animationFrame(value: number);
    set customMap0(value: Texture);
    set customMap1(value: Texture);
    set textureMatrix(value: Matrix4);
    private setValue;
}
