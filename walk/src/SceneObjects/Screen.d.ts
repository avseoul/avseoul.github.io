import { Mesh, Texture } from "three";
export default class Screen extends Mesh {
    constructor(width: number, height: number);
    setTexture(texture: Texture): void;
}
