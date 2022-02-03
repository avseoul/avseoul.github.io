import { ShaderMaterialParameters } from "three";
export default class RenderToTextureHandler {
    private _scene;
    private _material;
    constructor(blitShader: string, options?: ShaderMaterialParameters);
    setShaderParameter(param: string, value: any): void;
    render(targetRenderTexture: any): void;
    renderToScreen(): void;
}
