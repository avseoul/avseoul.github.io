var feedback_frag = 
`
varying vec2 v_uv;

uniform float u_audio_history;

uniform sampler2D u_tex_src;
uniform sampler2D u_tex_input;
uniform sampler2D u_tex_noise;

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

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
	vec2 m_uv = v_uv;

	vec2 m_noise = texture2D(u_tex_noise, m_uv).rg;
    vec3 m_src = texture2D(u_tex_src, m_uv).rgb;
    vec3 m_input = texture2D(u_tex_input, m_uv).rgb;

	vec3 m_c = m_input + m_src;
	m_c *= .96;

    float m_noise_pattern = cal_noise(m_uv * 2. + u_audio_history);

    // hsv
    m_c = rgb2hsv(m_c);
    m_c.r += u_audio_history*.01*m_noise_pattern; // hue shifting
    m_c = hsv2rgb(m_c);

	gl_FragColor = vec4(m_c,1);
}
`;