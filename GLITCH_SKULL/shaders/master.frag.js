var master_frag = 
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
	float m_aframe = u_audio_history;

	// rgb_shift
	float m_rgb_shift = .2;

	float _r = texture2D(u_tex_src, m_uv + vec2(m_rgb_shift*pow(m_ahigh, 15.), 0.)).r;
	float _g = texture2D(u_tex_src, m_uv  ).g;
	float _b = texture2D(u_tex_src, m_uv - vec2(m_rgb_shift*pow(m_ahigh, 15.), 0.)).b;

	vec3 m_c = vec3(_r, _g, _b);

	// vertical color burn seed
 	{
	 	float _seed = noise(m_uv.yy * .8 - m_aframe);
	 	_seed = pow(_seed, 3.);
	 	_seed *= 3.;
	 	m_c = mix(m_c, m_c.bgr, _seed);
	}

	{
		float _nr = hash(m_uv.xy + m_ahigh + u_t*.01);
		float _ng = hash(m_uv.xy + m_amid + u_t*.01);
		float _nb = hash(m_uv.xy + m_abass + u_t*.01);
		vec3 _noise = vec3(_nr, _ng, _nb);

		// canvas noise
		m_c *= (_noise + 1.);
	}

	// VHS color bar burn 
	{
		// slice vars
		const float m_num_slice = 2.;
		float m_slice = floor(m_uv.y * m_num_slice);
	    // float m_rand = hash(m_slice/m_num_slice + .4562341, 0.);
	    // m_rand *= hash(m_rand/m_num_slice, m_aframe);

		// create random seed
		float _seed_a = hash(m_slice/10. + .12347, -m_aframe * 1.9);
		float _seed_b = hash(m_slice/5. + .34562, -m_aframe * 1.7);
		float _seed_c = hash(m_slice/2. + .78906, -m_aframe * 1.8);

		// color burn based on seed event 
		if(.36 < m_ahigh){
			m_c.r *= _seed_a * hash(m_ahigh, .23) * 16.;
			m_c.g *= _seed_b * hash(m_ahigh, .34) * 16.;
			m_c.b *= _seed_c * hash(m_ahigh, .45) * 16.;
		}
	}

	gl_FragColor = vec4(m_c, 1);
}
`;