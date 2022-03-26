import { WebGLRenderTarget } from "three";
import RenderToTextureHandler from "../Helpers/RenderToTextureHandler";
export default class MasterBuffer extends RenderToTextureHandler {
    private _renderTarget;
    get renderTarget(): WebGLRenderTarget;
    constructor(w: number, h: number);
    resetBuffer(w: number, h: number): void;
    render(): void;
}
