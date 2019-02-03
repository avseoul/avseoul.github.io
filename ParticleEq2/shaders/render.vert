#version 300 es

precision highp float;
precision highp int;

#define LIGHT_A vec3(100., 100., 100.)
#define DIFFUSE_INTENSITY .82
#define SPECULAR_INTENSITY .01   
#define AMBIENT_INTENSITY .002

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
out vec3 vInstanceColors;
out float vInstanceIndices;

vec3 calcPhong(in vec3 lightPos, in vec3 pos, in vec3 norm, in vec3 diffuseCol, in vec3 specularCol) {

    vec3 lightDir = normalize(lightPos - pos);
    vec3 reflectDir = reflect(-lightDir, norm);
    vec3 viewDir = normalize(-pos); 

    float lambertian = max(dot(lightDir, norm), 0.);
    float specular = pow(max(dot(reflectDir, viewDir), 0.), 4.);

    return DIFFUSE_INTENSITY * diffuseCol * lambertian + SPECULAR_INTENSITY * specularCol * specular;
}

void main() {

    vec4 instancePositions = texture(uInstancePositions, instanceTexcoords);
    vec4 instanceVelocities = texture(uInstanceVelocities, instanceTexcoords);

    vec4 worldPos = modelMatrix * vec4(position * (instancePositions.w * .5) + instancePositions.xyz, 1.);
    vec3 worldNormal = normalMatrix * normal;
    vec3 worldViewDir = uWorldcCamPos - worldPos.xyz;

    vec3 diffCol = .02 * instanceColors;
    vec3 specCol = vec3(1.);

    vec3 brdf = vec3(0.);
    brdf += calcPhong(LIGHT_A, worldPos.xyz, worldNormal, diffCol, specCol);
    brdf += normalize(instanceVelocities.xyz) * length(normalize(instanceVelocities.xyz)) * .08;

    vColor = brdf;
    vInstanceIndices = instanceIndices;
    vInstanceColors = instanceColors;
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}