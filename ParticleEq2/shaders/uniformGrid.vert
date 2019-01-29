#version 300 es

precision highp float;
precision highp int;

uniform sampler2D uPosTex;

uniform float uPosTexWidth;
uniform float uGridTexWidth;
uniform float uNumGridSliceInGridTexWidth;
uniform float uGridSliceWidth;
uniform float uHalfGridSliceWidth;

layout(location = 0) in float aId;
layout(location = 1) in vec2 aTexCoords;

out float vId;
out float vOutOfGrid;

vec3 voxelToTexel(in vec3 voxel) {

    float vOffset = floor(voxel.z / uNumGridSliceInGridTexWidth);
    float uOffset = voxel.z - uNumGridSliceInGridTexWidth * vOffset;

    vec2 coords = vec2(
        voxel.x + uOffset * uGridSliceWidth, 
        voxel.y + vOffset * uGridSliceWidth) / (uGridTexWidth - 1.);

    // to ndc
    coords = coords * 2. - 1.;

    return vec3(coords, voxel.z / uGridSliceWidth);
}

void main() {

    vId = aId;

    vec3 pos = texture(uPosTex, aTexCoords).xyz;

    vOutOfGrid = (
        abs(pos.x) > uHalfGridSliceWidth || 
        abs(pos.y) > uHalfGridSliceWidth || 
        abs(pos.z) > uHalfGridSliceWidth) ? 1. : 0.;

    vec3 voxelCoord = vec3(0);
    vec3 texelCoord = vec3(0);

    if(vOutOfGrid < .5) {

        voxelCoord = floor(pos) + vec3(uHalfGridSliceWidth); 
        texelCoord = voxelToTexel(voxelCoord);
    } 

    gl_Position = vec4(texelCoord, 1.);
    gl_PointSize = 1.;
}
    