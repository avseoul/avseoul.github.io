import { RawShaderMaterial, Scene, ShaderMaterialParameters } from "three";
export default class RenderToTextureHandler {
    protected _material: RawShaderMaterial;
    private _scene;
    get scene(): Scene;
    constructor(blitShader: string, options?: ShaderMaterialParameters);
    setUniform(param: string, value: any): void;
    setDefine(key: string, value?: any): void;
    updateUniforms(): void;
    render(renderTarget: any): void;
}
