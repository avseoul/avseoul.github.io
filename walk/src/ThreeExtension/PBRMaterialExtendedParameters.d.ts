import { Matrix4, MeshPhysicalMaterialParameters, Texture } from "three";
export default interface PBRMaterialExtendedParameters extends MeshPhysicalMaterialParameters {
    fresnel?: number | undefined;
    fresnelPower?: number | undefined;
    totalElapsedTime?: number | undefined;
    animationFrame?: number | undefined;
    customMap0?: Texture | undefined;
    customMap1?: Texture | undefined;
    textureMatrix?: Matrix4 | undefined;
}
