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

out float vId;
out float vOutOfGrid;

vec2 idToUv(in float id) {

    float d = id / uPosTexWidth;
    float v = floor(d);
    float u = d - v;

    return vec2(u, v) / uPosTexWidth;
}

// vec2 voxelToTexel(in vec3 voxel) {

//     float d = voxel.z / uNumGridSliceInGridTexWidth;
//     float uOffset = floor(d);
//     float vOffset = d - uOffset;

//     vec2 coords = vec2(
//         voxel.x + uOffset * uGridSliceWidth, 
//         voxel.y + vOffset * uGridSliceWidth);

//     // to uv coord    
//     coords /= uGridTexWidth;
//     // to ndc
//     coords = coords * 2. - 1.;

//     return  coords;
// }

vec2 voxelToTexel(vec3 pos) {
    float u = pos.x + 
            float(uGridSliceWidth) * 
            (
                pos.z - float(uNumGridSliceInGridTexWidth) * 
                floor(pos.z / float(uNumGridSliceInGridTexWidth))
            );

    float v = pos.y + 
            float(uGridSliceWidth) * 
            floor(pos.z / float(uNumGridSliceInGridTexWidth));

    return ((floor(vec2(u, v)) + .5) / float(uGridTexWidth)) * 2. - vec2(1.);
}

void main() {

    vId = aId;

    vec2 posTexCoord = idToUv(aId);
    vec3 pos = texture(uPosTex, posTexCoord).xyz;

    vOutOfGrid = (
        abs(pos.x) > uHalfGridSliceWidth || 
        abs(pos.y) > uHalfGridSliceWidth || 
        abs(pos.z) > uHalfGridSliceWidth) ? 1. : 0.;

    vec2 texelCoord = vec2(0);

    if(vOutOfGrid < .5) {

        vec3 voxelCoord = floor(pos + vec3(uHalfGridSliceWidth)); 
        texelCoord = voxelToTexel(voxelCoord);
    } 

    gl_Position = vec4(texelCoord, 0., 1.);
    // gl_Position = vec4(posTexCoord, 0., 1.);
    gl_PointSize = 1.;
}
    