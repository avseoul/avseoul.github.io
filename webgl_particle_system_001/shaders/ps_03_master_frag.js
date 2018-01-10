var master_frag = 
`
uniform sampler2D tex_sprite;
uniform vec3 theme_cols[2];

varying float v_size;
varying float v_fbm;

void main() {
	vec2 uv = gl_FragCoord.xy / screen_res * .5;
    float size = v_size;

    vec3 c = vec3(size);

    c *= (v_fbm * theme_cols[0] + (1.-v_fbm) * theme_cols[1]);

    gl_FragColor = vec4(c, 1.) * texture2D(tex_sprite, gl_PointCoord);
}
`;