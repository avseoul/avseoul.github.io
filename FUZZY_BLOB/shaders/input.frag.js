var input_frag = 
`
varying vec2 v_uv;

uniform float u_t;
uniform vec2 u_res;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

uniform sampler2D u_tex_src;
uniform sampler2D u_tex_noise;

uniform vec2 u_mouse;
uniform vec2 u_mouse_dir;

vec4 advect(sampler2D _tex, vec2 _uv, vec2 _dir, vec2 _texel){
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

float hash(float _v, float _t) {
	return fract(sin(_v)*43758.5453123 + _t);
}

float hash(vec2 p) {
	float h = dot(p,vec2(127.1,311.7));
	return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float cal_noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);

	vec2 u = f*f*(3.0-2.0*f);

	return mix(mix(hash( i + vec2(0.0,0.0) ), 
		hash( i + vec2(1.0,0.0) ), u.x),
	mix( hash( i + vec2(0.0,1.0) ), 
		hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

#define SQRT_TWO 1.41421356237
#define OCTAVE 6
#define COMPLEXITY 18.
#define STROKE_SIZE .08
#define STROKE_INTENSITY .00088
#define AUDIO_FUZZY_INTENSITY .004
#define DAMPING .96

void main(){
	vec2 m_noise = texture2D(u_tex_noise, v_uv).rg;
	vec3 m_src = advect(u_tex_src, v_uv, m_noise * 40., 1. / (u_res * .2)).rgb;

    float noise = 0.;
    for(int i = 0; i < OCTAVE; i++) {
    	vec2 uv = v_uv * COMPLEXITY * float(i);
    	uv.y += u_t;
        noise += cal_noise(uv);
    }
    noise /= float(OCTAVE);
	
    vec2 m_audio_f = noise * normalize(.5-v_uv);
    
    float dist = distance(v_uv, u_mouse);
	dist = max(dist, STROKE_SIZE);
    float mag = SQRT_TWO - dist;

	vec2 m_out = m_src.rg;
	m_out += u_mouse_dir * mag * STROKE_INTENSITY / (dist * dist);
	m_out += m_audio_f * AUDIO_FUZZY_INTENSITY * u_audio_level;
	m_out *= DAMPING;

	gl_FragColor = vec4(m_out, 0, 1);
}
`;