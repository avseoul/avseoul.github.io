var chan_mixer_frag = 
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

uniform vec2 u_mouse;
uniform vec2 u_mouse_dir;

void main(){
	vec2 m_uv = v_uv;
	float m_mouse_delta = length(u_mouse_dir);

	vec2 gr = texture2D(u_tex_src, m_uv + vec2(.001, .001)).rg;
	vec2 gg = texture2D(u_tex_src, m_uv).rg;
	vec2 gb = texture2D(u_tex_src, m_uv - vec2(.001, .001)).rg;

	float c_size = 1.3;
	float c_pow = 12.;

	vec2 c_uv_r = (gr*2.-1.)*c_size;
	float c_radial_r = pow(sqrt(c_uv_r.x*c_uv_r.x+c_uv_r.y*c_uv_r.y), c_pow);
	vec2 c_uv_g = (gg*2.-1.)*c_size;
	float c_radial_g = pow(sqrt(c_uv_g.x*c_uv_g.x+c_uv_r.g*c_uv_g.y), c_pow);
	vec2 c_uv_b = (gb*2.-1.)*c_size;
	float c_radial_b = pow(sqrt(c_uv_b.x*c_uv_b.x+c_uv_b.y*c_uv_b.y), c_pow);

	gr.x = c_radial_r;
	gg.x = c_radial_g;
	gb.x = c_radial_b;

	vec3 c = vec3(gr.x+gg.x+gb.x, 0, gr.y+gg.y+gb.y)/2.;

	gl_FragColor = vec4(c,1.);
}
`;