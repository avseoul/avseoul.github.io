#version 300 es

precision highp float;
precision highp int;

in float vId;
in float vOutOfGrid;

layout(location = 0) out vec4 oOut;

void main() {

    if(vOutOfGrid > .5) discard;

    float id = vId;
    if (id == 0.) id = .5;

    oOut = vec4(id, id, id, id);
}


