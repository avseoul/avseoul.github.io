#version 300 es

precision highp float;
precision highp int;

#define LIGHT_A vec3(10., 10., 10.)
#define DIFFUSE_INTENSITY .42
#define SPECULAR_INTENSITY .3   
#define AMBIENT_INTENSITY .001

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

uniform vec3 uWorldcCamPos;

uniform sampler2D uInstancePositions;
uniform sampler2D uInstanceVelocities;

out vec2 vUv;
out vec3 vColor;
out float vInstanceIndices;

vec3 calcPhong(in vec3 lightPos, in vec3 pos, in vec3 norm, in vec3 diffuseCol, in vec3 specularCol) {

    vec3 lightDir = normalize(lightPos - pos);
    vec3 reflectDir = reflect(-lightDir, norm);
    vec3 viewDir = normalize(-pos); 

    float lambertian = max(dot(lightDir, norm), 0.);
    float specular = pow(max(dot(reflectDir, viewDir), 0.), 14.);

    return DIFFUSE_INTENSITY * diffuseCol * lambertian + SPECULAR_INTENSITY * specularCol * specular;
}

void main() {

    vec4 instancePositions = texture(uInstancePositions, instanceTexcoords);
    vec4 instanceVelocities = texture(uInstanceVelocities, instanceTexcoords);

    vec4 worldPos = modelMatrix * vec4(position * (instancePositions.w * .2) + instancePositions.xyz, 1.);
    vec3 worldNormal = normalMatrix * normal;
    vec3 worldViewDir = uWorldcCamPos - worldPos.xyz;

    vec3 diffCol = vec3(.01) + pow(length(instanceVelocities.xyz), 2.) * .003;
    vec3 specCol = vec3(1.) * pow(length(instanceVelocities.xyz), 2.) * .001;

    vec3 brdf = vec3(0.);
    brdf += calcPhong(LIGHT_A, worldPos.xyz, worldNormal, diffCol, specCol);

    vColor = brdf;
    vInstanceIndices = instanceIndices;
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}