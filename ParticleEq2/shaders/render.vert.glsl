#version 300 es

precision highp float;
precision highp int;

#define LIGHT_A vec3(10., 10., 10.)
#define DIFFUSE_INTENSITY .05
#define SPECULAR_INTENSITY 0.09   
#define AMBIENT_INTENSITY .015

in vec3 position;
in vec3 normal;
in vec2 uv;
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

vec3 calcPhong(in vec3 lightPos, in vec3 pos, in vec3 norm, in vec3 diffuseCol, in vec3 specularCol) {

    vec3 lightDir = normalize(lightPos - pos);
    vec3 reflectDir = reflect(-lightDir, norm);
    vec3 viewDir = normalize(-pos); 

    float lambertian = max(dot(lightDir, norm), 0.);
    float specular = pow(max(dot(reflectDir, viewDir), 0.), 16.);

    return DIFFUSE_INTENSITY * diffuseCol * lambertian + SPECULAR_INTENSITY * specularCol * specular;
}

void main() {
    
    vUv = uv;

    vec4 instancePositions = texture(uInstancePositions, instanceTexcoords);
    vec4 instanceVelocities = texture(uInstanceVelocities, instanceTexcoords);

    vec4 worldPos = modelMatrix * vec4(position * instancePositions.w + instancePositions.xyz, 1.);
    vec3 worldNormal = normalMatrix * normal;
    vec3 worldViewDir = uWorldcCamPos - worldPos.xyz;

    vec3 brdf = vec3(0.);
    brdf += calcPhong(LIGHT_A, worldPos.xyz, worldNormal, instanceVelocities.xyz, instanceVelocities.xyz);
    brdf += AMBIENT_INTENSITY * instanceColors * length(instanceVelocities.xyz);

    vColor = brdf;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}