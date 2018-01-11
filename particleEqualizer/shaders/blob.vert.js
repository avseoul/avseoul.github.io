var blob_vert = 
`
uniform vec2 u_mouse;
uniform vec2 u_mouse_delta;
uniform float u_t;
uniform bool u_is_init;

varying float v_noise;

float cal_noise(vec3 _uv, float _res){
	// original code from 
	// https://www.shadertoy.com/user/Trisomie21

	const vec3 s = vec3(1e0, 1e2, 1e4);
	
	_uv *= _res;
	
	vec3 uv0 = floor(mod(_uv, _res))*s;
	vec3 uv1 = floor(mod(_uv+vec3(1.), _res))*s;
	
	vec3 f = fract(_uv); f = f*f*(3.0-2.0*f);
	
	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
	
	vec4 r = fract(sin(v*1e-3)*1e5);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	r = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	return mix(r0, r1, f.z);
}

void main(){
	vec3 m_noise_seed = position.xyz;
	float m_noise_complexity = 1.;
	float m_noise_time = u_t * 1.;
	float m_noise_scale = .9;
    
    float m_fbm = 0.;

    const int m_noise_oct = 6;
    for(int i = 0; i < m_noise_oct; i++){
    	m_fbm += cal_noise(
    		m_noise_seed + m_noise_time * float(i),
    		m_noise_complexity * float(i)
    	);
    }
    m_fbm /= float(m_noise_oct);
    
    // get color 
    float m_noise_col = pow(1.-m_fbm, 3.5);
    v_noise = m_noise_col;                
    
    vec3 m_pos = position + normal * m_fbm * m_noise_scale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(m_pos, 1.);
}
`