var chan_mixer_frag = 
`
varying vec2 v_uv;

uniform float u_t;
uniform bool u_is_init;
uniform vec2 u_res;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

uniform sampler2D u_tex_src;

uniform vec2 u_mouse;
uniform vec2 u_mouse_dir;

void main(){
	vec2 m_uv = v_uv;
	float m_mouse_delta = length(u_mouse_dir);

	vec2 m_src = texture2D(u_tex_src, m_uv).rg;

	float m_blob_size = .6;
	float m_blob_fuzziness = 5.;

	vec2 m_circular_uv = (m_src * 2.-1.) * m_blob_size;
	m_circular_uv.x *= u_res.x / u_res.y;
	float m_blob = pow( sqrt( m_circular_uv.x * m_circular_uv.x + m_circular_uv.y * m_circular_uv.y ), m_blob_fuzziness );
	m_blob *= 15.;

	vec3 c = vec3(m_blob, 0., m_src.g);

	float m_oscil = (sin(u_audio_history*.5)+1.)*.5;
	
	// add some gradient color
	c = mix(c, c.bgr, m_oscil);

	// white lower bar
	c.g += pow((1.-v_uv.y),3.)*.4*u_audio_level; 

	// another mix 
	c = mix(c, normalize(c), m_oscil);
	
	// boost brightness
	c *= 1.5;

	gl_FragColor = vec4(c,1.);
}
`;