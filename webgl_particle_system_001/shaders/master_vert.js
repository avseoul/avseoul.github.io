var master_vert =
`
#ifdef IS_BUFFER
#else
    uniform sampler2D tex_feedback;
    uniform vec2 mouse;
    uniform bool is_init;
    uniform float t;
    uniform vec2 aperture_locs[4];
    uniform float aperture_sizes[4];
    uniform float aperture_size_magnifiers[4];
    uniform bool is_attract;
    uniform float attract_transition_frame;
    uniform bool is_unidirection;
    varying float v_size;
    varying float v_fbm;
    varying float v_line_render_factor;
    vec2 custom_normalize(vec2 _t){
        vec2 _n = _t != vec2(0.) ? normalize(_t) : vec2(0.);
        return _n;
    }
    vec3 custom_normalize(vec3 _t){
        vec3 _n = _t != vec3(0.) ? normalize(_t) : vec3(0.);
        return _n;
    }
    float hash( float n ){return fract(sin(n)*43758.5453);}
    float cal_noise( vec2 x ){
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);
        float n = p.x + p.y*57.0;
        return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
    }
#endif

void main() {
#ifdef IS_BUFFER
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
#else
     float aspect_x = SCREEN_RES.x / SCREEN_RES.y;
    float aspect_y = SCREEN_RES.y / SCREEN_RES.x;
    vec3 pos = position;

    // vertical movement with transition
    pos += .5;
    pos.y += t*.3 + 3.5*attract_transition_frame;
    pos = fract(pos) - .5;

    // discard line on the edge of canvas
    const float bound = .48;
    if(pos.y < -bound || pos.y > bound || pos.x < -bound || pos.x > bound)
        v_line_render_factor = 0.;
    else
        v_line_render_factor = 1.;
    
    // add feedback 
    vec2 feedback = texture2D(tex_feedback, uv).rg;
    pos.xy += feedback*3.;

    // add noise to ps
    float noise = 0.;
    const int oct = 12;
    for(int i = 0; i < oct; i++) {
        noise += cal_noise(uv * 15. * float(i) * (1.+feedback) + t*float(i));
    }
    float fbm = noise/float(oct);

    // layout
    if(is_unidirection) {
        pos.xy *= 1.2;
        pos.y += (fbm * .2 - .1);
        pos.x += fbm * .2 - .1;
    } else {
        const float complexity = 26.;
        vec2 rand_dir = vec2(cal_noise(uv*complexity * (1.+length(feedback))), cal_noise(uv.yx*complexity * (1.+length(feedback)))) -.5;
        pos.xy += rand_dir * fbm * .4;
    }

    // apertures
    for(int i = 0; i < 4; i++){
        vec2 a_a_loc = aperture_locs[i];
        a_a_loc.y *= aspect_y;

        float _dist = distance(a_a_loc, pos.xy);
        vec2 _dir = custom_normalize(pos.xy - a_a_loc);
        vec2 _f = _dir * .00001/(_dist * _dist) * aperture_sizes[i] * pow(aperture_size_magnifiers[i], 2.);

        pos.xy += _f;
    }
    pos.y *= aspect_x;
    float size = pow(fbm, 5.) * 12. + length(feedback)*10.;
    float size_mag = 10. + 5. * attract_transition_frame;
    gl_PointSize = size * size_mag;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    v_size = size * .1;
    v_fbm = 1. - pow(fbm, 5.) + length(feedback)*10.;
#endif
}
`;