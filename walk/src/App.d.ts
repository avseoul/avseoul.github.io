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
    private static _isMobile;
    static get isMobile(): boolean;
    private _TWOPI;
    private _walker;
    private _particles;
    private _skybox;
    private _floor;
    private _screen;
    private _camera;
    private _cameraControl;
    private _scene;
    private _lights;
    private _lightHandler;
    private _stats;
    private _mouseX;
    private _mouseY;
    private _width;
    private _height;
    private _halfWidth;
    private _halfHeight;
    private _useLightings;
    private _debugTextures;
    private _cameraNeedsUpdate;
    private _prevTime;
    private _timeScale;
    private _diceRespawnCounter;
    constructor();
    private update;
    private resetSkybox;
    private randomize;
    private setTimeScale;
    private setLightPosition;
    onMouseMove(event: MouseEvent): void;
    private setupGUI;
}
