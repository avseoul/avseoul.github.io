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

uniform sampler2D u_tex_noise;

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

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
  vec2 m_uv = v_uv;

  // audio input vars
  float m_ahigh = u_audio_high;
  float m_amid = u_audio_mid;
  float m_abass = u_audio_bass;
  float m_alevel = u_audio_level;
  float m_aframe = u_audio_history;

  m_uv.y -= m_aframe * .2;

  float m_noise_pattern = 0.;

  vec2 _uv = m_uv.yy - m_aframe*.05;
  m_noise_pattern += noise( _uv * 520.) * m_alevel;
  float _r = texture2D(u_tex_noise, fract(_uv - m_noise_pattern*.1)).r;

  _uv = m_uv.yy + m_aframe*.1;
  m_noise_pattern += noise( _uv * 520.) * m_alevel;
  float _g = texture2D(u_tex_noise, fract(_uv + m_noise_pattern*.05)).g;

  _uv = m_uv.yy - m_aframe*.02;
  m_noise_pattern += noise( _uv * 520.) * m_alevel;
  float _b = texture2D(u_tex_noise, fract(_uv - m_noise_pattern*.08)).b;

  vec3 m_c = vec3(_r, _g, _b);

  m_c *= m_noise_pattern;
  m_c = pow(m_c, vec3(10.))*.04;

  // hsv
  m_c = rgb2hsv(m_c);
  m_c.r += m_aframe; // hue shifting
  m_c.g = m_alevel*2.; // sat boost
  m_c = hsv2rgb(m_c);

  gl_FragColor = vec4(m_c, 1);
}
`;