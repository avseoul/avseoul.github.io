#version 300 es

#define SPHERE_R 8.
#define GRAVITY .28
#define TIME_DELTA .05
#define MAX_VEL 8.

precision highp float;
precision highp int;

uniform sampler2D uPosBuffer;
uniform sampler2D uVelBuffer;

uniform float uIsInit;
uniform float uTime;

in vec2 vUv;

layout(location = 0) out vec4 oPosBuffer;
layout(location = 1) out vec4 oVelBuffer;

vec2 hash( vec2 p ) {

    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p ) {

    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    vec2 i = floor(p + (p.x+p.y)*K1);	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, vec3(70.0));	
}

void main() {

    vec4 pos = texture(uPosBuffer, vUv);
    float mass = pos.w;
    vec4 vel = texture(uVelBuffer, vUv);
    
    vec4 force = vec4(0., 0., 0., 1.);

    // gravity
    {
        force.y -= GRAVITY * mass;
    }
    // {
    //     vec3 gravity = normalize(-pos.xyz);
    //     force.xyz += - .2 * gravity / mass;
    // }

    // sphere collision 
    // https://stackoverflow.com/a/19195972
    // {
    //     for(int i = 0; i < BUFFER_X; i++) {

    //         for(int j = 0; j < BUFFER_Y; j++) {

    //             vec2 coord = vec2(float(i) / float(BUFFER_X + 1), float(j) / float(BUFFER_Y + 1));
    //             vec4 elmPos = texture(uPosBuffer, coord);

    //             float dist = distance(pos.xyz, elmPos.xyz);

    //             if(dist < (pos.w + elmPos.w) * .5) {

    //                 vec4 elmVel = texture(uVelBuffer, coord);

    //                 vec3 collisionNormal = normalize(pos.xyz - elmPos.xyz);
    //                 vec3 collisionDirection = vec3(-collisionNormal.y, collisionNormal.x, 0);
                    
    //                 if (dot(collisionNormal, vel.xyz) > 0. || dot(collisionNormal, elmVel.xyz) < 0.) {

    //                     vec3 v1Parallel = dot(collisionNormal, vel.xyz) * collisionNormal;
    //                     vec3 v1Ortho    = dot(collisionDirection, vel.xyz) * collisionDirection;
    //                     vec3 v2Parallel = dot(collisionNormal, elmVel.xyz) * collisionNormal;
    //                     vec3 v2Ortho    = dot(collisionDirection, elmVel.xyz) * collisionDirection;

    //                     float totalMass = pos.w + elmPos.w;
    //                     v1Parallel = (v1Parallel * (pos.w - elmPos.w) + 2. * elmPos.w * v2Parallel) / totalMass;
    //                     // v2Parallel = (v2Parallel * (elmPos.w - pos.w) + 2. * pos.w * v1Parallel) / totalMass;
                        
    //                     // force.xyz *= .1;
    //                     // vel.xyz *= 2.;
    //                     // force.xyz += ((v1Parallel + v1Ortho) - vel.xyz) * .01;
    //                 }
    //             }
    //         }
    //     }
    // }

    // keep in sphere
    {
        float dist = length(pos.xyz);

        if(dist > SPHERE_R - pos.w * .5) {

            vec3 dir = reflect(normalize(vel.xyz), normalize(-pos.xyz));
            
            force.xyz *= .65;
            force.xyz += dir * length(vel.xyz) * .1;    
            force.xyz += normalize(-pos.xyz) * (dist - SPHERE_R - pos.w * .5);
        }
    }

    vel.xyz += force.xyz;

    // // clamping vel
    if(length(vel.xyz) > MAX_VEL) {

        vel.xyz = normalize(vel.xyz) * MAX_VEL;
    }

    // // damping
    vel.xyz *= .96;

    // // temp vel.w
    vel.w = 1.;

    pos.xyz += vel.xyz * TIME_DELTA;

    // pos.y += sin(uTime * .001) * .01;
    // pos.x += cos(uTime * .01) * .03;
    // pos.z += sin(uTime * -.01) * .5;

    // init position
    if(uIsInit < .5) {

        float n1 = noise(vec2(vUv.x * -123.456, vUv.y * 789.012));
        float n2 = noise(vec2(vUv.x * 345.678, vUv.y * -901.234));
        float n3 = noise(vec2(vUv.x * -567.890, vUv.y * 123.456));

        vec3 dir = normalize( vec3(n1, n2, n3) );

        float scale = 1.;//abs(n2) * .6 + .4;

        pos = vec4(dir * n1 * SPHERE_R * .9, scale);
        // pos = vec4(vUv * 16., 0., 1.);
    }

    oPosBuffer = pos;
    oVelBuffer = vel;
}