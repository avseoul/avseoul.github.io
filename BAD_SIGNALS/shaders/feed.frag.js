var feed_frag =
`
varying vec2 v_uv;

uniform float u_t;
uniform bool u_is_init;

uniform vec2 u_screen_res;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

uniform sampler2D u_tex_src;
uniform sampler2D u_tex_blend;

void main(){
	vec3 m_src = texture2D( u_tex_src, v_uv).rgb;
	vec3 m_blend = texture2D( u_tex_blend, vec2(1.-v_uv.x, v_uv.y)).rgb;

	vec3 m_c = m_src - pow(m_blend,vec3(6.))*10.;

    gl_FragColor = vec4(m_c, 1.);
}
`;