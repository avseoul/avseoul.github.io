var monochrome_intense_frag =
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
	
	float m_glitch = 0.;

	// vertical movemnet
	m_uv.y -= m_aframe*.5 + pow(m_abass, 5.);

	// wave
	{
		vec2 _seed_a = vec2(m_alevel, m_uv.y) + 80.*u_t;
		vec2 _seed_b = vec2(-m_alevel, m_uv.y) - 100.*u_t;

		float _zig = 0., _low = 0., _high = 0.;

		// horizontal wavy ziggle
		m_glitch += pow(noise(_seed_a * 2.), 3.) * .2 * m_alevel;
		m_glitch -= pow(noise(_seed_b * 2.), 3.) * .2 * m_alevel; 

		// high freq wav
		m_glitch += pow(noise(_seed_a * 3.), 3.) * .2 * m_ahigh; 
		m_glitch -= pow(noise(-_seed_b * 3.), 3.) * .2 * m_ahigh; 
		
		m_uv += m_glitch;
	}

	// render image 
	{
		float rgb_shift = .3 * m_ahigh * m_glitch + .008 * m_alevel;

		c.r = texture2D(u_tex_src, fract(m_uv + vec2(rgb_shift))).g;
		c.g = texture2D(u_tex_src, fract(m_uv)).g;
		c.b = texture2D(u_tex_src, fract(m_uv + vec2(-rgb_shift))).g;
	}

	// rolling bar
	{	
		c = mix(c, vec3(0.), m_glitch*20.);
	}

	gl_FragColor = vec4(c, 1.);
}
`;