#version 300 es

precision highp float;
precision highp int;

in vec2 vUv;
in vec3 vColor;

out vec4 oColor;

void main() {
    
    vec3 col = vColor;
    float alpha = 1.;

    col = pow(col, vec3(0.45));

    oColor = vec4(col, alpha);
}