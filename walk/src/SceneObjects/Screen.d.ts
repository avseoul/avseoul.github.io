import { Mesh, Texture } from "three";
export default class Screen extends Mesh {
    constructor(width: number, height: number);
    update(time: number): void;
    setTexture(texture: Texture): void;
}
