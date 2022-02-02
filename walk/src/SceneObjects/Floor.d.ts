import { Mesh } from "three";
export default class Floor extends Mesh {
    constructor(size: number, segments: number);
    update(animationFrame: number): void;
}
