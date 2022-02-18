import { Texture } from "three";
import RenderToTextureHandler from "./RenderToTextureHandler";
export default class BlurPassHandler extends RenderToTextureHandler {
    private _blurRenderTarget0;
    private _blurRenderTarget1;
    private readonly _mapSize;
    private readonly _hor;
    private readonly _ver;
    get blurMap(): Texture;
    constructor();
    render(source: Texture): void;
    private getRenderTarget;
}
