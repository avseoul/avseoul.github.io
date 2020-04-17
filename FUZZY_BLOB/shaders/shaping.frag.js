var shaping_frag = 
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
uniform sampler2D u_tex_input;

uniform vec2 u_mouse;
uniform vec2 u_mouse_dir;

void main(){
	vec2 m_uv = v_uv;
	float m_mouse_delta = length(u_mouse_dir);

	vec2 m_input = texture2D(u_tex_input, m_uv).rg;
	m_uv += m_input;
	vec2 m_src = texture2D(u_tex_src, m_uv).rg;

	vec2 r_dir = normalize(v_uv - m_src.rg);
	float r_dist = distance(v_uv, m_src.rg);
	
	vec2 c = m_src + (r_dir * r_dist * .05);

	gl_FragColor = vec4(c, 0., 1.);
}
`;