var master_frag = 
`
varying vec2 v_uv;

uniform sampler2D u_tex_src;

void main(){
	gl_FragColor = texture2D(u_tex_src, v_uv);
}
`;