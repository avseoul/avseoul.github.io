var glitch_frag = 
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

	vec3 c;

	// audio input vars
	float m_ahigh = u_audio_high;
	float m_amid = u_audio_mid;
	float m_abass = u_audio_bass;
	float m_alevel = u_audio_level;
	float m_aframe = u_audio_history;

	// slice vars
	const float m_num_slice = 2.;
	float m_slice = floor(m_uv.y * m_num_slice);
    float m_rand = hash(m_slice/m_num_slice + .4562341, 0.);
    m_rand *= hash(m_rand/m_num_slice, m_aframe);

	// VHS color bar ziggle
	{
		// up&down ziggle
		m_uv -= .5;
		m_uv.y += (2. * m_ahigh * (1.-2.*m_rand)) * m_rand;
		m_uv += .5;
	}

	// render image 
	{
		float rgb_shift = .08 * m_alevel;

		c.r = texture2D(u_tex_src, fract(m_uv + vec2(rgb_shift))).r;
		c.g = texture2D(u_tex_src, fract(m_uv)).g;
		c.b = texture2D(u_tex_src, fract(m_uv + vec2(-rgb_shift))).b;
	}

	// VHS blend ziggle
	{
		vec2 m_ziggle_uv = m_uv;
		m_ziggle_uv.y += (1.-2.*hash(m_ahigh, m_aframe))*.1 * m_rand;
		vec3 m_blend_ziggle = texture2D(u_tex_src, fract(m_ziggle_uv)).rgb;
		c += m_blend_ziggle;
		c /= 2.;
	}

	// VHS color bar burn 
	{
		// create random seed
		float _seed_a = hash(m_slice/10. + .12347, -m_aframe * 1.9);
		float _seed_b = hash(m_slice/5. + .34562, -m_aframe * 1.7);
		float _seed_c = hash(m_slice/2. + .78906, -m_aframe * 1.8);
		float m_seed = (_seed_a * _seed_b * _seed_c)/3.; //<-- normalized 0-1
		
		// seed selector bar
		// should be less than 1.
		float m_noise_freq = m_ahigh * .1;

		// color burn based on seed event 
		if(m_noise_freq > m_seed){
			c.r *= _seed_a * hash(m_ahigh, .23) * 16.;
			c.g *= _seed_b * hash(m_ahigh, .34) * 16.;
			c.b *= _seed_c * hash(m_ahigh, .45) * 16.;
		}
	}

	gl_FragColor = vec4(c, 1.);
}
`;