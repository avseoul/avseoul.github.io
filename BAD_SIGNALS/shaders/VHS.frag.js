var VHS_frag = 
`
varying vec2 v_uv;

uniform float u_t;
uniform bool u_is_init;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

uniform sampler2D u_tex_src;

float hash(float _v, float _t) {
	return fract(sin(_v)*43758.5453123 + _t);
}

float hash(vec2 p) {
	float h = dot(p,vec2(127.1,311.7));
	return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);

	vec2 u = f*f*(3.0-2.0*f);

	return mix(mix(hash( i + vec2(0.0,0.0) ), 
		hash( i + vec2(1.0,0.0) ), u.x),
	mix( hash( i + vec2(0.0,1.0) ), 
		hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main(){
	vec2 m_uv = v_uv;

	// audio input vars
	float m_ahigh = u_audio_high;
	float m_amid = u_audio_mid;
	float m_abass = u_audio_bass;
	float m_alevel = u_audio_level;
	float m_aframe = u_audio_history * .1;

	// vertical ziggle
	m_uv.y -= (.5 - m_ahigh) * .03 + m_aframe*m_alevel;
 	
 	// rgb shifting
 	float _interlace_noise = (.5-hash(m_uv.yy + m_aframe)) * .0008;
 	float _rs_offset = .02;
 	float _r = texture2D(u_tex_src, fract(m_uv + _interlace_noise + vec2(-(.5-m_ahigh)*_rs_offset, 0.) )).r;
 	float _g = texture2D(u_tex_src, fract(m_uv + _interlace_noise + vec2(-(.5-m_amid )*_rs_offset, 0.) )).g;
 	float _b = texture2D(u_tex_src, fract(m_uv + _interlace_noise + vec2(-(.5-m_abass)*_rs_offset, 0.) )).b;

 	// layer
 	vec3 m_src = vec3(_r, _g, _b);
 	vec3 m_bad = m_src.bgr;

 	// vertical color burn seed
 	{
	 	float _seed = noise(m_uv.yy * .8 - m_aframe);
	 	_seed = pow(_seed, 3.);
	 	_seed *= 10.;
	 	m_src = mix(m_src, m_bad, _seed);
	}

 	// noise color burn 
 	{
	 	float _noise = (.5-noise( vec2(v_uv.x, v_uv.y - u_t*10.) * 1. )) * m_alevel;
	 	float _seed = distance(v_uv + _noise, vec2(.5));
	 	m_src = mix(m_src, m_bad.rbg, _seed);
	}

 	// add noise
 	float _nr = hash(m_uv.xy + m_ahigh + u_t*.01);
	float _ng = hash(m_uv.xy + m_amid + u_t*.01);
	float _nb = hash(m_uv.xy + m_abass + u_t*.01);
	vec3 _noise = vec3(_nr, _ng, _nb);

	m_src += _noise * .04 * (1.+m_ahigh);
 	
 	gl_FragColor = vec4(m_src, 1.);

}
`;