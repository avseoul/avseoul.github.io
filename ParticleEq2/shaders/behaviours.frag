#version 300 es

precision highp float;
precision highp int;

uniform sampler2D uPosBuffer;
uniform sampler2D uVelBuffer;
uniform sampler2D uGridBuffer;

uniform float uIsInit;
uniform float uTime;
uniform float uNumParticleSqrt;

uniform float uGridTexWidth;
uniform float uNumGridSliceInGridTexWidth;
uniform float uGridSliceWidth;
uniform float uHalfGridSliceWidth;

uniform float uGlobalGravity;
uniform float uLocalGravity;
uniform float uOrbitAcc;
uniform float uRandomAcc;
uniform float uRandomScalePop;
uniform float uKeepInSphere;
uniform float uSphereRadius;
uniform float uScaleDamping;
uniform float uTimeDelta;
uniform float uMaxVel;

uniform float uAudioVolume;
uniform float uAudioHigh;
uniform float uAudioMiddle;
uniform float uAudioLow;
uniform float uAudioHistory;

in vec2 instanceTexcoords;
in vec2 vUv;

layout(location = 0) out vec4 oPosBuffer;
layout(location = 1) out vec4 oVelBuffer;

float hash(vec3 p)
{
    p  = fract(p * .3183099 + .1);
	p *= 17.;
    return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}

// https://www.shadertoy.com/view/4sfGzS
float snoise(vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(p+vec3(0,0,0)), 
                        hash(p+vec3(1,0,0)),f.x),
                   mix( hash(p+vec3(0,1,0)), 
                        hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(p+vec3(0,0,1)), 
                        hash(p+vec3(1,0,1)),f.x),
                   mix( hash(p+vec3(0,1,1)), 
                        hash(p+vec3(1,1,1)),f.x),f.y),f.z);
}

vec2 norm(in vec2 v) {

    return length(v) == 0. ? vec2(0.) : normalize(v);
}

vec3 norm(in vec3 v) {

    return length(v) == 0. ? vec3(0.) : normalize(v);
}

vec2 idToUv(in float id) {

    float v = floor(id / uNumParticleSqrt);
    float u = id - uNumParticleSqrt * v;

    return vec2(u, v) / (uNumParticleSqrt - 1.);
}

vec2 voxelToTexel(in vec3 voxel) {

    float vOffset = floor(voxel.z / uNumGridSliceInGridTexWidth);
    float uOffset = voxel.z - uNumGridSliceInGridTexWidth * vOffset;

    vec2 coords = vec2(
        voxel.x + uOffset * uGridSliceWidth, 
        voxel.y + vOffset * uGridSliceWidth) / (uGridTexWidth - 1.);

    return coords;
}

void main() {

    float pId = floor(vUv.x * uNumParticleSqrt) + floor(vUv.y * uNumParticleSqrt) * uNumParticleSqrt;
    vec2 uv = idToUv(pId);

    vec4 pos = texture(uPosBuffer, uv);
    vec4 vel = texture(uVelBuffer, uv);
    vec4 force = vec4(0., 0., 0., 1.);

    // init position
    if(uIsInit < .5) {

        float n0 = snoise(vec3(vUv.x * 123.456, vUv.y * 789.012, vUv.x * 345.678) + uTime) * 2. - 1.;
        float n1 = snoise(vec3(vUv.y * 901.234, vUv.x * 567.890, vUv.y * 123.456) + uTime) * 2. - 1.;
        float n2 = snoise(vec3(vUv.x * 789.012, vUv.y * 345.678, vUv.x * 901.234) + uTime) * 2. - 1.;

        vec3 dir = norm( vec3(n0, n1, n2) );
        float distRand = (abs(n0) + abs(n1) + abs(n2)) / 3.;

        float scale = 1. + pow(abs(n0 + n1 + n2) / 3., 3.) * 3.;

        pos = vec4(dir * uSphereRadius * distRand * 2.5, scale );
        vel.w = 1.;

        oPosBuffer = pos;
        oVelBuffer = vel;

        return;
    }
    
    // uniform grid
    vec3 voxel = round(pos.xyz) + vec3(uHalfGridSliceWidth);

    for (int i = -1; i < 2; i++) {

        for (int j = -1; j < 2; j++) {

            for (int k = -1; k < 2; k++) {

                vec3 neighborVoxel = voxel + vec3(i, j, k);
                
                if (neighborVoxel.x < 0. || 
                    neighborVoxel.y < 0. || 
                    neighborVoxel.z < 0. ||
                    neighborVoxel.x > float(uGridSliceWidth) || 
                    neighborVoxel.y > float(uGridSliceWidth) ||
                    neighborVoxel.z > float(uGridSliceWidth)) {

                    continue;
                }

                vec2 neighborUv = voxelToTexel(neighborVoxel);
                vec4 neighborPId = texture(uGridBuffer, neighborUv);

                for (int ch = 0; ch < 4; ch++) {

                    vec2 coord = idToUv(neighborPId[ch]);
                    vec4 elmPos = texture(uPosBuffer, coord);

                    float dist = distance(pos.xyz, elmPos.xyz);
                    
                    float MIN_DIST = (pos.w + elmPos.w) * .5;

                    if(dist < MIN_DIST) {

                        vec4 elmVel = texture(uVelBuffer, coord);

                        float K = -.9;
                        float N = .2;

                        force.xyz += K * (MIN_DIST - dist) * norm(elmPos.xyz - pos.xyz);
                        force.xyz += N * (elmVel.xyz - vel.xyz);
                    }
                }
            }
        }
    }

    float dice = snoise(vec3(uTime, uTime, uTime));

    // gravity
    {
        vec3 dir = norm(-pos.xyz);
        force.xyz += uLocalGravity * dir * pos.w * (uAudioLow + uAudioVolume);
        force.y -= uGlobalGravity * pos.w;
    }
    
    // orbit
    {
        vec3 dir = reflect(norm(vel.xyz), norm(-pos.xyz));
        force.xyz += dir * length(vel.xyz) * uOrbitAcc * pos.w * uAudioVolume;    
    }
    
    // random expanding
    {
        float n = snoise(pos.xyz * 10. + uTime * .01) * 2. - 1.;
        force.xyz += vec3(n) * .6 * uRandomAcc * uAudioVolume;
        force.w += n * uRandomScalePop;
    }
    
    // keep it in the sphere 
    
    if(uKeepInSphere > .5)
    {
        float dist = length(pos.xyz);

        if(dist > uSphereRadius - pos.w * .5) {

            pos.xyz = norm(pos.xyz) * uSphereRadius;    
        }
    }

    // size random
    if(uAudioHigh > .2) {

        float n = snoise(vec3(vUv.x * 123.456, vUv.y * 789.012, vUv.x * 345.678) + uTime) * 2. - 1.;
        
        pos.w += pow(abs(n), 10.) * uRandomScalePop;
    } 

    // noise size 
    pos.w += pow(abs(snoise(pos.xyz * .1 + uTime * .002)), 2.) * .5 * uAudioVolume;

    if(pos.w >= vel.w) {

        pos.w *= uScaleDamping;

    } else {

        pos.w = vel.w;
    }


    vel.xyz += force.xyz / pos.w;

    // clamping vel
    float maxVel = uMaxVel * pow(uAudioVolume + uAudioLow * .5, 2.);
    if(length(vel.xyz) > maxVel) {

        vel.xyz = norm(vel.xyz) * maxVel;
    }

    // damping
    vel.xyz *= .96;

    pos.xyz += vel.xyz * uTimeDelta * (uAudioVolume + uAudioLow);

    // reset scale
    // if(pos.w > 12.) pos.w = 1.;

    oPosBuffer = pos;
    oVelBuffer = vel;
}