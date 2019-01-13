#version 300 es

precision lowp float;
precision lowp int;

uniform sampler2D uTex;

in vec2 vUv;

out vec4 oColor;

void main() {
    
    oColor = texture(uTex, vUv);
}