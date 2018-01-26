var input_frag = 
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
	vec3 m_src = texture2D(u_tex_src, m_uv).rgb;
	float m_mouse_delta = length(u_mouse_dir);

	vec2 eye = u_mouse;
	eye.y = 1.-eye.y;
	float dist = distance(m_uv, eye);
	float maxDist = sqrt(2.);
	float decay = pow(maxDist - dist, 40.);
	float mag = m_mouse_delta * .0002 * decay;

	vec2 mouse_out = u_mouse_dir * mag * (.98/dist*dist*.005);
	mouse_out += m_src.rg;
	mouse_out *= .99;

	gl_FragColor = vec4(mouse_out,0,1);
}
`;