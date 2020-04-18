var chan_mixer_frag = 
`
varying vec2 v_uv;

uniform vec2 u_res;

uniform float u_audio_high;
uniform float u_audio_history;

uniform sampler2D u_tex_src;

void main(){
	vec2 src = texture2D(u_tex_src, v_uv).rg;

	vec2 coord = (src * 2. - 1.) * .6;
	coord.x *= u_res.x / u_res.y;
	float blob = pow( sqrt(coord.x * coord.x + coord.y * coord.y), 5. );
	blob *= 15.;

	vec3 c = vec3(blob, 0., src.g);

	float oscil = sin(u_audio_history * .5) * .5 + .5;	
	c = mix(c, c.bgr, oscil);

	c.g += (1. - v_uv.y) * u_audio_high;
	c.r += v_uv.y * u_audio_high;

	c = mix(c, normalize(c), oscil);
	c *= (1. + u_audio_high * .3);

	gl_FragColor = vec4(c, 1.);
}
`;