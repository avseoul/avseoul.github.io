var chan_mixer_frag = 
`
varying vec2 v_uv;

uniform vec2 u_res;

uniform float u_audio_high;
uniform float u_audio_history;

uniform sampler2D u_tex_src;

void main(){
	vec2 src = texture2D(u_tex_src, v_uv).rg;

	vec2 coord = (src * 2. - 1.) * .9;
	coord.x *= u_res.x / u_res.y;
	float blob = pow( sqrt(coord.x * coord.x + coord.y * coord.y), 10. );

	vec3 c = vec3(blob, 0., src.g);

	float oscil = smoothstep(0., 1., sin(u_audio_history * .5) * .5 + .5);	
	float oscilInv = 1. - oscil;
	c = mix(c, c.bgr, oscil);

	float fu = smoothstep(.0, 1., v_uv.y) * u_audio_high;
	float fd = smoothstep(.0, 1., 1. - v_uv.y) * u_audio_high;
	c.g += fd * oscil;
	c.r += fd * oscilInv;
	c.r += fu * oscil;

	c = mix(c, normalize(c), oscil);
	c *= (1. + fd);
	c = pow(c, vec3(.62));

	gl_FragColor = vec4(c, 1.);
}
`;