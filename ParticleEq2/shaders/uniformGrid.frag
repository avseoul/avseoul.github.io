#version 300 es

precision highp float;
precision highp int;

in float vId;
in float vOutOfGrid;

layout(location = 0) out vec4 oOut;

void main() {

    if(vOutOfGrid > .5) discard;

    oOut = vec4(vId, vId, vId, vId);
}


