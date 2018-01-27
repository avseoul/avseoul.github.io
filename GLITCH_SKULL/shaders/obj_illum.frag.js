var obj_illum_frag = 
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

  // audio input vars
  float m_ahigh = u_audio_high;
  float m_amid = u_audio_mid;
  float m_abass = u_audio_bass;
  float m_alevel = u_audio_level;
  float m_aframe = u_audio_history * .1;
  
  // chromatic aberration rgb shifting
  float _r, _g, _b;
  {
    vec2 _dir = normalize(vec2(.5) - m_uv);
    float _dist = distance(m_uv, vec2(.5));
    vec2 _offset = _dir * _dist * .04;
    _r = texture2D(u_tex_src, fract(m_uv + m_ahigh*_offset )).r;
    _g = texture2D(u_tex_src, fract(m_uv + m_amid*_offset )).g;
    _b = texture2D(u_tex_src, fract(m_uv + m_abass*_offset )).b;
  }

  // layer
  vec3 m_src = vec3(_r, _g, _b);
  vec3 m_bad = m_src.bgr;

  // noise pattern color burn 
  {
    float _noise = (.5-noise( vec2(v_uv.x, v_uv.y - u_t*10.) * 1. )) * m_alevel;
    float _seed = distance(v_uv + _noise, vec2(.5));
    m_src = mix(m_src, m_bad.rbg, _seed);
  }

  m_src = pow(m_src, vec3(5.));
  
  gl_FragColor = vec4(m_src, 1.);

}
`;