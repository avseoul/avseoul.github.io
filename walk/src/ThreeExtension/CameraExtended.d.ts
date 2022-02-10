import { PerspectiveCamera, Vector3 } from "three";
export default class CameraExtended extends PerspectiveCamera {
    constructor(width: number, height: number, fov?: number, near?: number, far?: number);
    resetProjectionMatrix(width: number, height: number): void;
    pan(position: Vector3, targetPosition: Vector3): void;
}
