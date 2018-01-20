var feed_frag =
`
varying vec2 v_uv;

uniform float u_t;
uniform bool u_is_init;

uniform vec2 u_screen_res;

uniform float u_audio_high;
uniform float u_audio_mid;
uniform float u_audio_bass;
uniform float u_audio_level;
uniform float u_audio_history;

uniform sampler2D u_tex_src;

void main(){
    gl_FragColor = texture2D( u_tex_src, v_uv);
}
`;