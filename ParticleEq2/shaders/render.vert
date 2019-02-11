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
uniform mat4 shadowMatrix;
uniform mat3 normalMatrix;

uniform sampler2D uInstanceVelocities;
uniform sampler2D uInstancePositions;

uniform float uIsShadowPass;
uniform float uParticleScaleFactor;

out vec2 vUv;
out vec3 vInstanceColors;
out float vInstanceIndices;
out vec4 vInstancePositions;
out vec4 vInstanceVelocities;
out vec3 vWorldPos;
out vec3 vWorldNormal;
out vec4 vShadowCoord;

void main() {

    vec4 instancePositions = texture(uInstancePositions, instanceTexcoords);
    vec4 instanceVelocities = texture(uInstanceVelocities, instanceTexcoords);

    vec3 pos = position * (instancePositions.w * .5 * uParticleScaleFactor) + instancePositions.xyz;

    if(uIsShadowPass > .5) {

        vShadowCoord = vec4(0.);

        gl_Position = shadowMatrix * vec4(pos, 1.);

        return;
    }
    
    vec4 worldPos = vec4(pos, 1.);//modelMatrix * vec4(pos, 1.); currently the particle is the top root
    vec4 viewPos = viewMatrix * worldPos;
    vec3 worldNormal = normalMatrix * normal;

    vInstanceIndices = instanceIndices;
    vInstanceColors = instanceColors;
    vInstancePositions = instancePositions;
    vInstanceVelocities = instanceVelocities;

    vUv = uv;
    vWorldPos = worldPos.xyz;
    vWorldNormal = worldNormal;

    vShadowCoord = shadowMatrix * vec4(pos, 1.);
    gl_Position = projectionMatrix * viewPos;
}