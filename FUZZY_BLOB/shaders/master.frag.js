var master_frag = 
`
varying vec2 v_uv;

uniform float u_t;
uniform bool u_is_init;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

void main(){
	vec2 m_uv = v_uv;

	vec3 m_src = texture2D(u_tex_src, m_uv).rgb;

	vec3 m_c = m_src;

	gl_FragColor = vec4(m_c, 1.);
}
`;