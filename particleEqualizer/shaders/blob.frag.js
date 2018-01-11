var blob_frag = 
`
varying float v_noise;


void main(){
	float m_noise = v_noise;
	float m_noise_inv = 1.-v_noise;

    vec3 m_diffuse = vec3(0.);
   	m_diffuse.r += m_noise_inv + m_noise;
   	m_diffuse.g += m_noise*1.5;
   	//m_diffuse.b += m_noise;
   	m_diffuse -= pow(1.-m_noise, 4.)*.95; //<- darken peak
   	m_diffuse = clamp(m_diffuse, vec3(0.), vec3(2.));

   	vec3 m_col = m_diffuse;
   	m_col = pow(m_col, vec3(2.2));

    gl_FragColor = vec4(m_col, 1.);
}
`