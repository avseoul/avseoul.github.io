var vhs_frag = 
`
varying vec2 v_uv;

uniform float t;
uniform bool is_init;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

uniform sampler2D u_tex_src;

float rand(float _v, float _t) {
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

float fbm(vec2 p) {
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	float f  = 0.0;

	for(int i = 1; i < 6; i++){
		float mul = 1.0/pow(2.0, float(i));
		f += mul*noise(p); 
		p = m*p;
	}

	return pow(f, 1.);
}

void main(){
	vec2 m_uv = v_uv;

	const float m_num_slice = 5.;

	float m_audio_in = u_audio_level;	
	float m_glitch_frame = u_audio_history;	
	
	float m_slice = floor(m_uv.y * m_num_slice);
    float m_rand = rand(m_slice/m_num_slice + .4562341, 0.);
    m_rand *= rand(m_rand/m_num_slice, m_glitch_frame);
	
	vec2 m_glitch_uv = m_uv;
	
	// up&down ziggle
	m_glitch_uv -= .5;
	{
		// y pos
		m_glitch_uv.y += (2. * m_audio_in * (1.-2.*m_rand));
	}
	m_glitch_uv += .5;
	
	// ver movement
	m_glitch_uv.y += (1.-2.*m_rand) * m_glitch_frame * .1;
	
	// rgb shift
	float rgb_shift = .05 * m_audio_in * m_rand;
	float r = texture2D(u_tex_src, fract(m_glitch_uv + vec2(rgb_shift, 0.))).g;
	float g = texture2D(u_tex_src, fract(m_glitch_uv + vec2(0., 0.))).g;
	float b = texture2D(u_tex_src, fract(m_glitch_uv + vec2(rgb_shift, 0.))).g;
	
	// create random seed
	float _seed_a = rand(m_slice/10. + .12347, -m_glitch_frame*1.9);
	float _seed_b = rand(m_slice/5. + .34562, -m_glitch_frame*1.7);
	float _seed_c = rand(m_slice/2. + .78906, -m_glitch_frame*1.8);
	float m_seed = (_seed_a * _seed_b * _seed_c)/3.; //<-- normalized 0-1
	
	// seed selector bar
	// should be less than 1.
	float m_glitch_freq = m_audio_in*.1;

	// color burn based on seed event 
	if(m_seed > m_glitch_freq){
		r *= _seed_a * rand(m_audio_in, .23) * 16.;
		g *= _seed_b * rand(m_audio_in, .34) * 16.;
		b *= _seed_c * rand(m_audio_in, .45) * 16.;
	}
	
	vec3 m_color = vec3(r, g, b);
	
	// blend ziggle
	vec2 m_ziggle_uv = m_uv;
	m_ziggle_uv.y += (1.-2.*rand(m_audio_in, m_glitch_frame))*.1;
	vec3 m_blend_ziggle = texture2D(u_tex_src, fract(m_ziggle_uv)).rgb;
	m_color += m_blend_ziggle;
	m_color /= 2.;
	
	// master blend
	m_uv.y = fract( m_uv.y + fbm( vec2(m_audio_in * 10., 0) )*.1 );
	vec3 m_master = texture2D(u_tex_src, fract(m_uv + rand(m_uv.y*9827233., m_glitch_frame) * .0001)).rgb;
	
	m_color += m_master;
	m_color /= 2.;
	
	// contrast
	m_color = pow(m_color, vec3(2.1)) * 3.;

	gl_FragColor = vec4(m_color, 1.);
}
`;