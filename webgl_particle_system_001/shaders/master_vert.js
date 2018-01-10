var master_vert =
`
#ifdef IS_BUFFER
#else
    uniform sampler2D tex_feedback;
    uniform vec2 mouse;
    uniform bool is_init;
    uniform float t;
    uniform bool is_attract;
    uniform float attract_transition_frame;
    uniform bool is_retina;
    
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
    pos.y += t*.95 + 4.5*attract_transition_frame;
    pos = fract(pos) - .5;

    // discard line on the edge of canvas
    const float _x_bound = .49;
    const float _y_bound = .49;
    if(pos.y < -_y_bound || pos.y > _y_bound || pos.x < -_x_bound || pos.x > _x_bound)
        v_line_render_factor = 0.;
    else
        v_line_render_factor = 1.;
    
    // add feedback 
    vec2 feedback = texture2D(tex_feedback, uv).rg;
    pos.xy += feedback*3.;

    // add noise to ps
    float noise = 0.;
    const int oct = 12;
    const float complexity = 18.;
    for(int i = 0; i < oct; i++) {
        noise += cal_noise(uv * complexity * float(i) * (1.+feedback) + t*float(i)*4.);
    }
    float fbm = noise/float(oct);

    // layout
    vec2 rand_dir = vec2(cal_noise(uv*complexity * (1.+length(feedback)) + t*5. ), cal_noise(uv.yx*complexity * (1.+length(feedback)) + t*13.6 )) -.5;
    pos.xy += rand_dir * fbm * .25;

    // adjust ratio to square 
    pos.x /= aspect_x;

    //
    float size = (pow(fbm, 5.) * 30. + length(feedback)*30.) * 5.;

    v_size = is_retina ? size * .01 : size * .005;
    v_fbm = (1. - pow(fbm, 5.)) + length(feedback) * 2.5;

    gl_PointSize = size;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    
    
#endif
}
`;