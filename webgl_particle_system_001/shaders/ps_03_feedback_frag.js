var feedback_frag = `
uniform sampler2D tex_vel;
uniform sampler2D tex_p_feedback;
uniform sampler2D tex_noise;
uniform vec2 mouse;
uniform vec2 mouse_delta;
uniform float t;

vec4 advect(sampler2D _tex, vec2 _uv, vec2 _dir, float _texel){
    //https://www.shadertoy.com/view/MsyXRW
    const float _G0 = .25;
    const float _G1 = .125;
    const float _G2 = .0625;
    const float ADVECT_DIST = 2.;

    vec2 uv = _uv - _dir * ADVECT_DIST * _texel;

    vec2 n  = vec2( 0., 1.);
    vec2 ne = vec2( 1., 1.);
    vec2 e  = vec2( 1., 0.);
    vec2 se = vec2( 1.,-1.);
    vec2 s  = vec2( 0.,-1.);
    vec2 sw = vec2(-1.,-1.);
    vec2 w  = vec2(-1., 0.);
    vec2 nw = vec2(-1., 1.);

    vec4 c =    texture2D(_tex, fract(uv));
    vec4 c_n =  texture2D(_tex, fract(uv+_texel*n));
    vec4 c_e =  texture2D(_tex, fract(uv+_texel*e));
    vec4 c_s =  texture2D(_tex, fract(uv+_texel*s));
    vec4 c_w =  texture2D(_tex, fract(uv+_texel*w));
    vec4 c_nw = texture2D(_tex, fract(uv+_texel*nw));
    vec4 c_sw = texture2D(_tex, fract(uv+_texel*sw));
    vec4 c_ne = texture2D(_tex, fract(uv+_texel*ne));
    vec4 c_se = texture2D(_tex, fract(uv+_texel*se));

    return _G0*c+_G1*(c_n+c_e+c_w+c_s)+_G2*(c_nw+c_sw+c_ne+c_se);
}

void main(){
    vec2 uv = gl_FragCoord.xy / buffer_res;
     
     vec3 vel = texture2D(tex_vel, uv).rgb;
     vec2 noise = (texture2D(tex_noise, fract(uv - t * 2.)).rg - .5) * 2.;
     vec3 p_feedback = advect(tex_p_feedback, uv, noise, 1./2048.).rgb;
     
     vec3 feedback = p_feedback + vel;
     feedback *= .96;
     
     gl_FragColor = vec4(feedback,1);
}`;