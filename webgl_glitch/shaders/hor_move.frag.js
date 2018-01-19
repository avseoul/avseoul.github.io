var hor_move_frag = 
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

void main(){
	vec2 m_uv = v_uv;

	// move left
	m_uv.x += u_audio_history;
	
	// amplify a bit and ziggle with the bass
	m_uv.x += u_audio_bass * .7;

	gl_FragColor = vec4(texture2D(u_tex_src, fract(m_uv)).rgb, 1.);
}
`;