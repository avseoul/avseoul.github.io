var bg_frag = 
`
varying vec2 v_uv;

uniform float u_t;
uniform bool u_is_init;
uniform vec2 u_res;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

uniform sampler2D u_tex_src;

void main(){
  vec2 m_uv = v_uv;

  // audio input vars
  float m_ahigh = u_audio_high;
  float m_amid = u_audio_mid;
  float m_abass = u_audio_bass;
  float m_alevel = u_audio_level;
  float m_aframe = u_audio_history * .1;

  vec3 m_src = texture2D(u_tex_src, m_uv).rgb;

  gl_FragColor = vec4(m_src, 1);
}
`;