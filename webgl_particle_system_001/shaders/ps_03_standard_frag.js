var standard_frag = 
`
varying float v_size;
varying float v_fbm;
varying float v_line_render_factor;

uniform vec3 theme_cols[2];

void main() {
    vec2 uv = gl_FragCoord.xy / screen_res * .5;
    float size = v_size * .5;

    vec3 c = vec3(size);

    c *= (v_fbm * theme_cols[0] + (1.-v_fbm) * theme_cols[1]);
    c *= v_line_render_factor;

    float _t = c.r;
    c.r = c.b;
    c.b = _t;

    gl_FragColor = vec4(c, 1.);
}
`