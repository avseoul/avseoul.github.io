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

float hash(float _v, float _t) {
  return fract(sin(_v)*43758.5453123 + _t);
}

float hash(vec2 p) {
  float h = dot(p,vec2(127.1,311.7));
  return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 u = f*f*(3.0-2.0*f);

  return mix(mix(hash( i + vec2(0.0,0.0) ), 
    hash( i + vec2(1.0,0.0) ), u.x),
  mix( hash( i + vec2(0.0,1.0) ), 
    hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main(){
  vec2 m_uv = v_uv;

  vec3 m_src = texture2D(u_tex_src, m_uv).rgb;

  float m_noise_r = noise(v_uv.xy*.5+.2345+u_audio_history*1.456);
  float m_noise_b = noise(v_uv.xy*.5+.5678+u_audio_history*1.124);

  m_src.r += m_noise_r*.3;
  m_src.b += m_noise_b*.3;

  gl_FragColor = vec4(m_src, 1);
}
`;