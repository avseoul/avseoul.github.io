/* 
    *ACKNOWLEDGEMENT

    this sketches (mostly shader part) is inspired by and modified from 
    - 'Neon World(https://www.shadertoy.com/view/MlscDj)' 
    - 'Alien Corridor(https://www.shadertoy.com/view/4slyRs)' 
    by zguerrero(https://www.shadertoy.com/user/zguerrero/sort=popular&from=8&num=8) 

    author - Sehyun Av Kim

    av.seoul@gmail.com
    avseoul.net

    2018.02.05
*/ 

var scene_frag = 
`
varying vec2 v_uv;

uniform float u_t;
uniform bool u_is_init;
uniform vec2 u_res;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

#define MAX_RAY_STEPS 32
#define RAY_STOP_TRESHOLD 0.001
#define MENGER_ITERATIONS 5

float maxcomp(vec2 v) { return max(v.x, v.y); }

float sdCross(vec3 p) {
    p = abs(p);
    vec3 d = vec3(max(p.x, p.y),
                  max(p.y, p.z),
                  max(p.z, p.x));
    return min(d.x, min(d.y, d.z)) - (1.0 / 3.0);
}

float sdCrossRep(vec3 p) {
    vec3 q = mod(p + 1.0, 2.0) - 1.0;
    return sdCross(q);
}

float sdCrossRepScale(vec3 p, float s) {
    return sdCrossRep(p * s) / s;   
}

float scene(vec3 p) {
    float scale = 0.2;
    float dist = 0.0;
    
    for (int i = 0; i < MENGER_ITERATIONS; i++) {
        dist = max(dist, -sdCrossRepScale(p, scale));
        scale *= 3.0;
    }
    return dist;
}

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 colorize(float c) {
    
    float hue = 0.;
    float sat = 0.;
    float lum = c + .1;
    
    vec3 hsv = vec3(hue, sat, lum);
    vec3 rgb = hsv2rgb(hsv);
    
    return vec4(rgb, 1.0);  
}


void main()
{
    vec2 fragCoord = v_uv * u_res;
    vec2 screenpos = v_uv * 2.0 - 1.0;

    float m_time = u_t * 20.;
    
    vec3 cam_pos = vec3(.25 * sin(m_time), .25 * cos(m_time), m_time);
    vec3 cam_dir = normalize(cam_pos - vec3(0));
    
    vec3 cam_plane_u = vec3(1., 0., 0.);
    vec3 cam_plane_v = vec3(0., 1., 0.) * (u_res.y / u_res.x);

    vec3 raypos = cam_pos;
    vec3 raydir = cam_dir + screenpos.x * cam_plane_u + screenpos.y * cam_plane_v;
    
    float dist = scene(raypos);
    
    int stepsTaken;
    for (int i = 0; i < MAX_RAY_STEPS; i++) {
        if (dist < RAY_STOP_TRESHOLD) {
            continue;
        }

        raypos += raydir * dist;
        dist = scene(raypos);
        stepsTaken = i;
    }
    
    vec4 color = colorize( pow( float(stepsTaken) / float(MAX_RAY_STEPS), 3.0 ) );
    //color.rgb = vec3(1.);
    gl_FragColor = color;
}
`;