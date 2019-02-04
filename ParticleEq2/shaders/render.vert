#version 300 es

precision highp float;
precision highp int;

in vec3 position;
in vec3 normal;
in vec2 uv;
in float instanceIndices;
in vec3 instanceColors;
in vec2 instanceTexcoords;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform mat3 normalMatrix;

uniform sampler2D uInstanceVelocities;
uniform sampler2D uInstancePositions;

out vec2 vUv;
out vec3 vInstanceColors;
out float vInstanceIndices;
out vec4 vInstanceVelocities;
out vec3 vWorldPos;
out vec3 vWorldNormal;

void main() {

    vec4 instancePositions = texture(uInstancePositions, instanceTexcoords);
    vec4 instanceVelocities = texture(uInstanceVelocities, instanceTexcoords);

    vec4 worldPos = modelMatrix * vec4(position * (instancePositions.w * .5) + instancePositions.xyz, 1.);
    vec4 viewPos = viewMatrix * worldPos;
    vec3 worldNormal = normalMatrix * normal;

    vInstanceIndices = instanceIndices;
    vInstanceColors = instanceColors;
    vInstanceVelocities = instanceVelocities;

    vUv = uv;
    vWorldPos = worldPos.xyz;
    vWorldNormal = worldNormal;

    gl_Position = projectionMatrix * viewPos;
}