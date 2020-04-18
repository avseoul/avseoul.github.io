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
  float noise = v_noise;
  float noiseInv = 1. - v_noise;

  float c = noise * 1.5 - pow(abs(noiseInv), 4.) * .95;
  c = clamp(c, 0., 2.);
  c *= smoothstep(0., .9, u_audio_level);

#if defined(IS_WIRE) || defined(IS_POINTS)
  c += 1. * pow(abs(noise), 4.) * u_audio_level;
  c += .6 * noiseInv * u_audio_high * u_audio_high;;

  #if defined(IS_WIRE)
    c *= .1;
  #endif
#else
  c *= .2;
#endif 

  float cNoise = c * noise;
  vec3 col = vec3(c * 2., cNoise, cNoise);
  col = mix(col.gbr * sin(u_audio_history), col, noiseInv);

  gl_FragColor = vec4(col, 1.);

#if defined(IS_POINTS)
  gl_FragColor *= texture2D(tex_sprite, gl_PointCoord);
#endif

#if defined(IS_POP) || defined(IS_POP_OUT)
  gl_FragColor.rgb = pow(abs(gl_FragColor.rgb), vec3(1.2));
#endif
}
`