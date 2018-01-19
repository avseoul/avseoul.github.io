var subtle_frag = 
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

float hash(vec2 p) {
	float h = dot(p,vec2(127.1,311.7));
	return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);

	vec2 u = f*f*(3.0-2.0*f);

	return mix(mix(hash( i + vec2(0.0,0.0) ), 
		hash( i + vec2(1.0,0.0) ), u.x),
	mix( hash( i + vec2(0.0,1.0) ), 
		hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float fbm(vec2 p) {
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	float f  = 0.0;

	for(int i = 1; i < 6; i++){
		float mul = 1.0/pow(2.0, float(i));
		f += mul*noise(p); 
		p = m*p;
	}

	return pow(f, 1.);
}

void main(){
	vec2 m_uv = v_uv;

	float m_audio_in = u_audio_high;
	float m_audio_frame = u_audio_history;

	vec2 hp = vec2(0., m_uv.y + u_audio_high - u_audio_bass + u_audio_history*4.);
	float nh = ( fbm(hp * .5) ) * .01 * u_audio_bass;
	nh 		+= ( fbm(hp * 5.) ) * .1 * u_audio_mid;
	nh 		+= ( fbm(hp * 30.) ) * .1 * u_audio_high;
	
	float rgb_shift = .01 * m_audio_in;
	float r = texture2D(u_tex_src, fract(m_uv + vec2(nh + rgb_shift, 0.))).r;
	float g = texture2D(u_tex_src, fract(m_uv + vec2(nh, 0.0))).g;
	float b = texture2D(u_tex_src, fract(m_uv + vec2(nh - rgb_shift, 0.))).b;

	vec3 col = vec3(r, g, b);
	gl_FragColor = vec4(col, 1.);
}
`;