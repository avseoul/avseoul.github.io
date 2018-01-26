var blur_frag = 
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
uniform float u_mouse_delta;

void main(){
	vec2 m_uv = v_uv;
	float m_mouse_delta = length(u_mouse_dir);

	vec3 blur = vec3(0);
	vec2 res = u_res;
	vec2 m_vec = u_mouse_dir * m_mouse_delta * 10.;
	vec2 off1 = vec2(.311764705882353) * m_vec;
	vec2 off2 = vec2(.594117647058823) * m_vec;
	vec2 off3 = vec2(.176470588235294) * m_vec;
	blur += texture2D(u_tex_src, m_uv).rgb * .1964825501511404;
	blur += texture2D(u_tex_src, m_uv + (off1 / res)).rgb * .2969069646728344;
	blur += texture2D(u_tex_src, m_uv - (off1 / res)).rgb * .2969069646728344;
	blur += texture2D(u_tex_src, m_uv + (off2 / res)).rgb * .0944703978504473;
	blur += texture2D(u_tex_src, m_uv - (off2 / res)).rgb * .0944703978504473;
	blur += texture2D(u_tex_src, m_uv + (off3 / res)).rgb * .0103813624011480;
	blur += texture2D(u_tex_src, m_uv - (off3 / res)).rgb * .0103813624011480;

	blur = clamp(blur, vec3(0), vec3(1));
	gl_FragColor = vec4(blur,1.);
}
`;