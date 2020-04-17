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

uniform vec2 u_mouse;
uniform vec2 u_mouse_dir;
uniform float u_mouse_delta;

void main(){
	vec2 m_uv = v_uv;
	float m_mouse_delta = length(u_mouse_dir);

	vec3 c = texture2D(u_tex_src, m_uv).rgb;

	// debug mouse point
	float _md = distance(vec2(u_mouse.x, u_mouse.y * u_res.y/u_res.x), vec2(v_uv.x, v_uv.y * u_res.y/u_res.x));
	if(_md < .005)
		c = vec3(1., 0., 0.);

	gl_FragColor = vec4(c,1.);
}
`;