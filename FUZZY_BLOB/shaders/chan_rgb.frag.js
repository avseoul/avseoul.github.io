var chan_rgb_frag = 
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
uniform sampler2D u_tex_input;

uniform vec2 u_mouse;
uniform vec2 u_mouse_dir;

void main(){
	vec2 m_uv = v_uv;
	float m_mouse_delta = length(u_mouse_dir);

	vec2 blur = vec2(0);
	vec2 res = SCREEN_RES * 1000.;
	vec2 m_vec = u_mouse_dir * m_mouse_delta * 10.;
	vec2 off1 = vec2(.311764705882353) * m_vec;
	vec2 off2 = vec2(.594117647058823) * m_vec;
	vec2 off3 = vec2(.176470588235294) * m_vec;
	blur += texture2D(u_tex_input, m_uv).rg * .1964825501511404;
	blur += texture2D(u_tex_input, m_uv + (off1 / res)).rg * .2969069646728344;
	blur += texture2D(u_tex_input, m_uv - (off1 / res)).rg * .2969069646728344;
	blur += texture2D(u_tex_input, m_uv + (off2 / res)).rg * .0944703978504473;
	blur += texture2D(u_tex_input, m_uv - (off2 / res)).rg * .0944703978504473;
	blur += texture2D(u_tex_input, m_uv + (off3 / res)).rg * .0103813624011480;
	blur += texture2D(u_tex_input, m_uv - (off3 / res)).rg * .0103813624011480;

	m_uv += blur;// + blur * float(3-cIndex)/3.;

	vec4 glitch = texture2D(u_tex_src, m_uv);

	vec2 r_t = v_uv;
	vec2 r_dir = normalize(r_t-glitch.rg);
	float r_dist = distance(r_t, glitch.rg);
	glitch.rg += r_dir * r_dist * .05;


	gl_FragColor = glitch;
}
`;