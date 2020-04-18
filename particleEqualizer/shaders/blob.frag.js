var blob_frag = 
`

varying float v_noise;

uniform float u_audio_high;
uniform float u_audio_level;
uniform float u_audio_history;

vec3 norm(in vec3 _v){
  return length(_v) > .0 ? normalize(_v) : vec3(.0);
}

#if defined(IS_POINTS)
  uniform sampler2D tex_sprite;
#endif

void main(){
  float m_noise = v_noise;
  float m_noise_inv = 1.-v_noise;

  vec3 m_diffuse = vec3(0.);
  m_diffuse.rgb += m_noise_inv + m_noise;
  // m_diffuse.g += m_noise*1.5;
  // m_diffuse.b += m_noise;
  m_diffuse -= pow(abs(1.-m_noise), 4.)*.95; //<- darken peak
  m_diffuse = clamp(m_diffuse, vec3(0.), vec3(2.));

  m_diffuse *= pow(u_audio_level, 2.);

  vec3 m_col = m_diffuse;

#if defined(IS_WIRE) || defined(IS_POINTS)
  // inner ziggle
  m_col *= .4 * pow(abs(m_noise), 6.);
  
  // outter ziggle
  m_col += .2 * pow(abs(m_noise_inv), 4.);

  // treble burn
  m_col += pow(abs(u_audio_high), 3.) * 1.;

  // on&off
  m_col *= u_audio_level;

  #if defined(IS_WIRE)
    m_col *= .7;
  #endif
#endif 

  gl_FragColor = vec4(m_col, 1.);

#if defined(IS_POINTS)
  gl_FragColor *= texture2D(tex_sprite, gl_PointCoord);
#endif

#if defined(IS_POP) || defined(IS_POP_OUT)
  gl_FragColor.rgb = pow(abs(gl_FragColor.rgb), vec3(1.2));

  #if defined(IS_POINTS) && defined(IS_POP)
    gl_FragColor.rgb *= pow(u_audio_level, 2.);
    gl_FragColor.rgb *= 50.;
  #endif

  #if defined(IS_WIRE)
    gl_FragColor.rgb *= 2.;

    #if defined(IS_POP_OUT)
      gl_FragColor.rgb *= .2;
    #endif
  #endif
#endif

}
`