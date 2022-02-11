import { BufferGeometry } from "three";
export default class CustomInstancedBufferGeometry extends BufferGeometry {
    constructor(source: BufferGeometry, bufferLength: number, instanceCount: number, skinVerticeCount: number, skinMapLength: number);
}
