var aperture_master_points_frag = `
	uniform sampler2D tex_sprite;

	varying float v_transition_frame;
	
	void main(){
		gl_FragColor = texture2D(tex_sprite, gl_PointCoord) * v_transition_frame;
	}
`;