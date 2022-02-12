import { Camera, Matrix4, Mesh, Scene, WebGLRenderer } from "three";
export default class PlannarReflectionHandler {
    private _ref;
    private _renderTarget;
    private _reflectorPlane;
    private _normal;
    private _reflectorWorldPosition;
    private _cameraWorldPosition;
    private _rotationMatrix;
    private _lookAtPosition;
    private _clipPlane;
    private _view;
    private _target;
    private _q;
    private _textureMatrix;
    private _reflectionCamera;
    get texture(): import("three").Texture;
    get textureMatrix(): Matrix4;
    constructor(ref: Mesh, params: any);
    compute(renderer: WebGLRenderer, scene: Scene, camera: Camera): void;
}
