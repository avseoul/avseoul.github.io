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

var post_frag = 
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

uniform sampler2D u_tex_input;
uniform sampler2D u_tex_noise;

void main(){
    vec2 uv = v_uv;
    vec2 fragCoord = uv * u_res;
        
    float b = step(fract(uv.y * 50.0 + u_t), 0.5);
    vec4 tex = texture2D(u_tex_input, uv);
    vec4 tex2 = texture2D(u_tex_input, uv + vec2((b - 0.5)*0.005, 0.0));
    
    vec2 vign = smoothstep(vec2(0.5, 1.5), vec2(1.0, 0.98 + b*0.02), vec2(length(uv - 0.5) * 2.0)); 
       
    vec4 grain = texture2D(u_tex_noise, fragCoord.xy/256.0 + vec2(0.0, u_t*10.0));
    vec4 res = mix(tex, vec4(tex.x, tex.y, tex2.z, tex.w), vign.x);
    vec4 col = res * vign.y * (0.85 + grain*0.15);
    
    gl_FragColor = pow(col*1.75, vec4(1.25));
}
`;