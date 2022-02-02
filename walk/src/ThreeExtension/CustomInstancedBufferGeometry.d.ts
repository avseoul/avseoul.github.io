import { BufferGeometry } from "three";
export default class CustomInstancedBufferGeometry extends BufferGeometry {
    constructor(source: BufferGeometry, count: number, extraCount: number);
}
