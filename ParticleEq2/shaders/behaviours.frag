#version 300 es

#define SPHERE_R 18.
#define TIME_DELTA .1
#define MAX_VEL 3.

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

in vec2 instanceTexcoords;
in vec2 vUv;

layout(location = 0) out vec4 oPosBuffer;
layout(location = 1) out vec4 oVelBuffer;
layout(location = 2) out vec4 oForceBuffer;

vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289((x * 34.0 + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v   - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    // x1 = x0 - i1  + 1.0 * C.xxx;
    // x2 = x0 - i2  + 2.0 * C.xxx;
    // x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - 0.5;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec4 p =
      permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));  // mod(p,7*7)

    vec4 x_ = floor(j * (1.0 / 7.0));
    vec4 y_ = floor(j - 7.0 * x_ );  // mod(j,N)

    vec4 x = x_ * (2.0 / 7.0) + 0.5 / 7.0 - 1.0;
    vec4 y = y_ * (2.0 / 7.0) + 0.5 / 7.0 - 1.0;

    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    //vec4 s0 = vec4(lessThan(b0, 0.0)) * 2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1, 0.0)) * 2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 g0 = vec3(a0.xy, h.x);
    vec3 g1 = vec3(a0.zw, h.y);
    vec3 g2 = vec3(a1.xy, h.z);
    vec3 g3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
    g0 *= norm.x;
    g1 *= norm.y;
    g2 *= norm.z;
    g3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    m = m * m;

    vec4 px = vec4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
    return (42.0 * dot(m, px) + 1.) * .5;
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

                        force.xyz += K * (MIN_DIST - dist) * normalize(elmPos.xyz - pos.xyz);
                        force.xyz += N * (elmVel.xyz - vel.xyz);
                    }
                }
            }
        }
    }

    float dice = snoise(vec3(uTime, uTime, uTime));

    // gravity
    {
        vec3 dir = normalize(-pos.xyz);
        force.xyz += .12 * dir / pos.w;
        force.y -= .08 * pos.w;
    }
    // orbit
    {
        vec3 dir = reflect(normalize(vel.xyz), normalize(-pos.xyz));
        force.xyz += dir * length(vel.xyz) * .08 * pos.w;    
    }
    // random
    {
        float n0 = snoise(vec3(vUv.xyx * .2) + uTime * .0001) * 2. - 1.;
        float n1 = snoise(vec3(vUv.yxy * .2) + uTime * .0001) * 2. - 1.;
        float n2 = snoise(vec3(vUv.xxy * .2) + uTime * .0001) * 2. - 1.;
        
        force.xyz += vec3(n0, n1, n2) * .1;
    }
    // keep it in the sphere 
    {
        // float dist = length(pos.xyz);

        // if(dist > SPHERE_R - pos.w * .5) {

        //     pos.xyz = normalize(pos.xyz) * SPHERE_R;    
        // }
    }
    // size random
    if(abs(dice) < .01) {

        float n = snoise(vec3(vUv.x * 123.456, vUv.y * 789.012, vUv.x * 345.678) + uTime) * 2. - 1.;
        
        pos.w += pow(abs(n), 3.);
    } 

    if(pos.w >= 1.) {

        pos.w *= .993;

    } else {

        pos.w = 1.;
    }


    vel.xyz += force.xyz / pos.w;

    // clamping vel
    if(length(vel.xyz) > MAX_VEL) {

        vel.xyz = normalize(vel.xyz) * MAX_VEL;
    }

    // damping
    vel.xyz *= .96;

    // temp vel.w
    vel.w = 1.;

    pos.xyz += vel.xyz * TIME_DELTA;

    // reset scale
    if(pos.w > 6.) pos.w = 1.;

    // init position
    if(uIsInit < .5) {

        float n0 = snoise(vec3(vUv.x * 123.456, vUv.y * 789.012, vUv.x * 345.678)) * 2. - 1.;
        float n1 = snoise(vec3(vUv.y * 901.234, vUv.x * 567.890, vUv.y * 123.456)) * 2. - 1.;
        float n2 = snoise(vec3(vUv.x * 789.012, vUv.y * 345.678, vUv.x * 901.234)) * 2. - 1.;

        vec3 dir = normalize( vec3(n0, n1, n2) );
        float distRand = (abs(n0) + abs(n1) + abs(n2)) / 3.;

        pos = vec4(dir * SPHERE_R * distRand * 1.5, 1. + abs(n0 + n1 + n2) );
    }

    oPosBuffer = pos;
    oVelBuffer = vel;
}