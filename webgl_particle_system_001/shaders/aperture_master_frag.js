var aperture_master_frag = `
	varying float v_transition_frame;

	void main(){
		float transition_frame = v_transition_frame;
		vec3 c = vec3(1.);

		gl_FragColor = vec4(c, .2);
	}
`;