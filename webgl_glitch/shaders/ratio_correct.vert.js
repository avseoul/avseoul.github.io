var ratio_correct_vert = 
`
varying vec2 v_uv;

uniform vec2 u_src_res;
uniform vec2 u_screen_res;

void main() {
	vec3 m_pos = position;

	// width stay filling the canvas' width
	float m_screen_ratio = u_screen_res.x / u_screen_res.y;
	float m_tex_ratio = u_src_res.y / u_src_res.x;
	m_pos.y *= m_screen_ratio * m_tex_ratio;
	
    gl_Position = projectionMatrix * modelViewMatrix * vec4(m_pos, 1.);

    v_uv = uv;
}
`;