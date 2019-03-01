#version 300 es

precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D uParticleRenderTexture;
uniform sampler2D uWebcamTexture;
uniform sampler2D uOpticalFlowTexture;

uniform float uWidth;
uniform float uHeight;

uniform float uAudioVolume;
uniform float uAudioHigh;
uniform float uAudioMiddle;
uniform float uAudioLow;
uniform float uAudioHistory;

uniform float uTime;

out vec4 oColor;

#define NOISE_ROT_MAT mat2(2.60,  2.80, -2.80,  2.60)
#define FBM_COMPLEXITY 6.
#define SAMPLES 120.
#define TWO_PI 6.28318530718

vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289((x * 34.0 + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v   - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    // x1 = x0 - i1  + 1.0 * C.xxx;
    // x2 = x0 - i2  + 2.0 * C.xxx;
    // x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - 0.5;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec4 p =
      permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));  // mod(p,7*7)

    vec4 x_ = floor(j * (1.0 / 7.0));
    vec4 y_ = floor(j - 7.0 * x_ );  // mod(j,N)

    vec4 x = x_ * (2.0 / 7.0) + 0.5 / 7.0 - 1.0;
    vec4 y = y_ * (2.0 / 7.0) + 0.5 / 7.0 - 1.0;

    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    //vec4 s0 = vec4(lessThan(b0, 0.0)) * 2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1, 0.0)) * 2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 g0 = vec3(a0.xy, h.x);
    vec3 g1 = vec3(a0.zw, h.y);
    vec3 g2 = vec3(a1.xy, h.z);
    vec3 g3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
    g0 *= norm.x;
    g1 *= norm.y;
    g2 *= norm.z;
    g3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    m = m * m;

    vec4 px = vec4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
    return (42.0 * dot(m, px) + 1.) * .5;
}

vec2 norm(in vec2 v) {

    return length(v) == 0. ? vec2(0.) : normalize(v);
}

vec3 norm(in vec3 v) {

    return length(v) == 0. ? vec3(0.) : normalize(v);
}

float grid(float var, float size) 
{
    return floor(var * size)/size;
}

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float fbm(vec2 n, float t) 
{
	float total = 0.0;
	float amplitude = .8;

	for (float i = 0.; i < FBM_COMPLEXITY; i++) 
    {
		total += snoise(vec3(n, i) + t) * amplitude;
		n = NOISE_ROT_MAT * (n * 4. * amplitude);
		amplitude *= .4;
	}

	return max(total, 0.);
}

void main() 
{
    vec3 particleRender = texture(uParticleRenderTexture, vUv).rgb;
    vec3 webcam = texture(uWebcamTexture, vUv).rgb;
    vec3 opticalFlow = texture(uOpticalFlowTexture, vUv).rgb;
		
    // hash blur - https://www.shadertoy.com/view/4lXXWn
    float strength = .04;

    vec3 blur = vec3(0.);

    for (float i = 0.; i < SAMPLES; i++) 
    { 
        vec2 q = vec2(cos(i / SAMPLES * TWO_PI), sin(i / SAMPLES * TWO_PI)) *  rand(vec2(i + uTime, vUv.x + vUv.y)); 
        blur += texture(uParticleRenderTexture, vUv + (q * strength)).rgb;

        q = vec2(sin(i / SAMPLES * TWO_PI), cos(i / SAMPLES * TWO_PI)) *  rand(vec2(vUv.x + vUv.y, i + uTime)); 
        blur += texture(uParticleRenderTexture, vUv + (q * strength)).rgb;
    }
    blur /= SAMPLES * 2.;

    float t = uTime * 1.2 + uAudioHistory * .2;
    vec2 p = vUv * 1.6 + vec2(0., t * .1);
	float noise = fbm(p.xy + vec2(fbm(p.xy, t), fbm(p.yx, t)), t);
    noise = clamp(pow(noise, 3. * uAudioLow) * (3. * uAudioLow), 0., 1.);

    vec3 col = mix(blur, particleRender, noise);
    vec3 frosty = col * 1.5 + .16;
    col = mix(frosty, col + .06, noise);
        
    oColor = vec4(col, 1.);
}