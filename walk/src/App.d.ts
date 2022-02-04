import { OrthographicCamera, PlaneGeometry, PMREMGenerator, WebGLRenderer } from 'three';
import "./style.css";
export default class App {
    private static _renderer;
    static get renderer(): WebGLRenderer;
    private static _pmremGenerator;
    static get pmremGenerator(): PMREMGenerator;
    private static _screenOverlayCamera;
    static get screenOverlayCamera(): OrthographicCamera;
    private static _screenQuadGeometry;
    static get screenQuadGeometry(): PlaneGeometry;
    private _TWOPI;
    private _walker;
    private _particles;
    private _skybox;
    private _floor;
    private _screen;
    private _fbo;
    private _frameComposer;
    private _time;
    private _timeTweenMin;
    private _timeTweenMax;
    private _timeTween;
    private _camera;
    private _cameraControl;
    private _scene;
    private _lights;
    private _lightHandler;
    private _stats;
    private _mouseX;
    private _mouseY;
    private _isMouseDown;
    private _isPortrait;
    private _width;
    private _height;
    private _halfWidth;
    private _halfHeight;
    private _useLightings;
    private _debugTextures;
    private _cameraNeedsUpdate;
    constructor();
    private update;
    resetFrameBuffers(): void;
    private resetSkybox;
    private randomize;
    private handleTimeEvent;
    private setLightPosition;
    onMouseDown(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseUp(event: MouseEvent): void;
    onResize(): boolean;
    private setupGUI;
}
