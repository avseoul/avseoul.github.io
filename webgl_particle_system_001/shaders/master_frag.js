var master_frag = 
`
#ifdef IS_LINE
	varying float v_line_render_factor;
#else
	uniform sampler2D tex_sprite;
#endif

uniform vec3 theme_cols[2];

varying float v_size;
varying float v_fbm;

void main() {
	vec2 uv = gl_FragCoord.xy / SCREEN_RES * .5;
    float size = v_size;
    vec3 c = vec3(size);

#ifdef IS_LINE
    size *= .5;

    c *= (v_fbm * theme_cols[0] + (1.-v_fbm) * theme_cols[1]);
    c *= v_line_render_factor;

    float _t = c.r;
    c.r = c.b;
    c.b = _t;

    gl_FragColor = vec4(c, 1.);

#else
	c *= (v_fbm * theme_cols[0] + (1.-v_fbm) * theme_cols[1]);
    gl_FragColor = vec4(c, 1.) * texture2D(tex_sprite, gl_PointCoord);
#endif
}
`;