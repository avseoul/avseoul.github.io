export default class RenderToTextureHandler {
    private _scene;
    private _material;
    constructor(blitShader: string);
    setShaderParameter(param: string, value: any): void;
    render(targetRenderTexture: any): void;
}
