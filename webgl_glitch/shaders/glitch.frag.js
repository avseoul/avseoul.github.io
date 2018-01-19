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

uniform bool is_master_ziggle;
uniform bool is_monochrome;
uniform bool is_ntsc_rolling;
uniform bool is_low_wave;
uniform bool is_high_wave;
uniform bool is_bad_signals;
uniform bool is_VHS;

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
	
	float m_glitch = 0.;

	vec2 m_noise_seed = vec2(m_aframe*10., m_uv.y);

	// slice vars
	const float m_num_slice = 5.;
	float m_slice = floor(m_uv.y * m_num_slice);
    float m_rand = hash(m_slice/m_num_slice + .4562341, 0.);
    m_rand *= hash(m_rand/m_num_slice, m_aframe);

	// master ziggle
	if(is_master_ziggle){	
		m_uv.y -= m_aframe * .1;
		m_uv.y += m_abass;
		m_uv.y -= pow((1.-2.*m_ahigh), 3.) * .12;
	}

	// VHS color bar ziggle
	if(is_VHS){
		// up&down ziggle
		m_uv -= .5;
		m_uv.y += (2. * m_ahigh * (1.-2.*m_rand));
		m_uv += .5;
	}

	// wave
	{
		// low 
		if(is_low_wave){ 
			m_glitch += (noise(m_noise_seed * 5.) * .1 * m_abass);
		}

		// high
		if(is_high_wave){ 
			m_glitch += (noise(m_noise_seed * 100.) * (.01 * m_ahigh));
		}
	}

	// rgb shifting
	float rgb_shift = .5 * m_ahigh * m_glitch;
	if(is_monochrome){
		c.r = texture2D(u_tex_src, fract(m_uv + vec2(m_glitch + rgb_shift, 0.))).g;
		c.g = texture2D(u_tex_src, fract(m_uv + vec2(m_glitch, 0.0))).g;
		c.b = texture2D(u_tex_src, fract(m_uv + vec2(m_glitch - rgb_shift, 0.))).g;
	} else {
		c.r = texture2D(u_tex_src, fract(m_uv + vec2(m_glitch + rgb_shift, 0.))).r;
		c.g = texture2D(u_tex_src, fract(m_uv + vec2(m_glitch, 0.0))).g;
		c.b = texture2D(u_tex_src, fract(m_uv + vec2(m_glitch - rgb_shift, 0.))).b;
	}

	// VHS blend ziggle
	if(is_VHS){
		vec2 m_ziggle_uv = m_uv + m_glitch;
		m_ziggle_uv.y += (1.-2.*hash(m_ahigh, m_aframe))*.1;
		vec3 m_blend_ziggle = texture2D(u_tex_src, fract(m_ziggle_uv)).rgb;
		c += m_blend_ziggle;
		c /= 2.;
	}

	// ntsc rolling bar
	{
		c = mix(c, vec3(0.), pow(m_glitch,2.) * 30.);
	}

	// bad signal
	if(is_bad_signals){
		vec2 _seed = vec2(0., m_uv.y - m_aframe);
		float _mag = 1.+m_ahigh;
		float _invert_strength = .4;
		float _matte = ( noise(_seed * 10. * _mag) ) * (_invert_strength * _mag);

		float _noise_width = .01 * m_ahigh;
		vec2 _bad_uv = fract(
			m_uv + m_glitch 
			+ hash(m_uv.yy + u_audio_history) * _noise_width 
			+ _matte*.01);
		
		vec3 _bad = texture2D(u_tex_src, _bad_uv).ggg;
		if(is_monochrome)
			_bad *= _bad;

		c = mix(_bad, c, _matte * 10. * m_alevel);
	}

	// VHS color bar burn 
	if(is_VHS){
		// create random seed
		float _seed_a = hash(m_slice/10. + .12347, -m_aframe * 1.9);
		float _seed_b = hash(m_slice/5. + .34562, -m_aframe * 1.7);
		float _seed_c = hash(m_slice/2. + .78906, -m_aframe * 1.8);
		float m_seed = (_seed_a * _seed_b * _seed_c)/3.; //<-- normalized 0-1
		
		// seed selector bar
		// should be less than 1.
		float m_glitch_freq = m_ahigh * .1;

		// color burn based on seed event 
		if(m_seed > m_glitch_freq){
			c.r *= _seed_a * hash(m_ahigh, .23) * 16.;
			c.g *= _seed_b * hash(m_ahigh, .34) * 16.;
			c.b *= _seed_c * hash(m_ahigh, .45) * 16.;
		} else {
			if(is_monochrome)
				c.r = c.g = c.b;
		}
	}

	// VHS master blend
	if(is_VHS){
		m_uv.y = fract( m_uv.y + noise( vec2(m_alevel * 10., 0) )*.1 );
		vec3 m_master = texture2D(u_tex_src, fract(m_uv + m_glitch + hash(m_uv.y*9827233., m_aframe) * .0001)).rgb;

		if(is_monochrome)
			m_master.r = m_master.g = m_master.b;

		c += m_master;
		c /= 2.;

		// contrast
		c = pow(c, vec3(2.1)) * 3.;
	}

	gl_FragColor = vec4(c, 1.);
}
`;