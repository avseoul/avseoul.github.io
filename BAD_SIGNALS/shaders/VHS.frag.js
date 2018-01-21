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

	// rolling bar
	float m_rolling_bar = noise(m_uv.yy * 5. - m_aframe*5. + m_alevel*.8) * m_alevel; 

	// vertical ziggle
	m_uv.y -= pow(m_alevel, 5.)*.1*pow(m_abass, 5.);

	// wave
	{
		vec2 _seed_a = vec2(m_alevel, m_uv.y) + 80.*u_t;
		vec2 _seed_b = vec2(-m_alevel, m_uv.y) - 100.*u_t;

		float _zig = 0., _low = 0., _high = 0.;

		// horizontal wavy ziggle
		_zig += pow(noise(_seed_a * .2), 3.) * .3 * m_alevel;
		_zig -= pow(noise(_seed_b * .2), 3.) * .3 * m_alevel; 

		// low freq wav
		_low = _zig;

		// high freq wav
		_high += pow(noise(_seed_a * 30.), 6.) * .8 * m_ahigh; 
		_high -= pow(noise(-_seed_b * 30.), 6.) * .8 * m_ahigh; 
		
		m_uv.x += _zig;
		m_uv += (_low + _high)*pow(m_rolling_bar, 3.);
	}
 	
 	// chromatic aberration rgb shifting
 	float _r, _g, _b;
 	{
 		vec2 _dir = normalize(vec2(.5) - m_uv);
 		float _dist = distance(m_uv, vec2(.5));
	 	vec2 _offset = _dir * _dist * .04;
	 	_r = texture2D(u_tex_src, fract(m_uv + m_ahigh*_offset )).r;
	 	_g = texture2D(u_tex_src, fract(m_uv + m_amid*_offset )).g;
	 	_b = texture2D(u_tex_src, fract(m_uv + m_abass*_offset )).b;
	}

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

 	// noise pattern color burn 
 	{
	 	float _noise = (.5-noise( vec2(v_uv.x, v_uv.y - u_t*10.) * 1. )) * m_alevel;
	 	float _seed = distance(v_uv + _noise, vec2(.5));
	 	m_src = mix(m_src, m_bad.rbg, _seed);
	}

	// rolling bar color burn
	{	
		m_src = mix(m_src, m_bad, m_rolling_bar);
	}

 	// add noise
 	{
		float _nr = hash(m_uv.xy + m_ahigh + u_t*.01);
		float _ng = hash(m_uv.xy + m_amid + u_t*.01);
		float _nb = hash(m_uv.xy + m_abass + u_t*.01);
		vec3 _noise = vec3(_nr, _ng, _nb);

 		// rolling bar noise
		m_src += _noise * pow(m_rolling_bar, 5.);

		// canvas noise
		m_src += _noise * .1;
	}
 	
 	gl_FragColor = vec4(m_src, 1.);

}
`;