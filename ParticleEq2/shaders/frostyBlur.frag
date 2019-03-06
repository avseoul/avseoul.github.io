#version 300 es

precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D uBlurTexture;
uniform sampler2D uParticleRenderTexture;

uniform float uWidth;
uniform float uHeight;

uniform float uAudioVolume;
uniform float uAudioHigh;
uniform float uAudioMiddle;
uniform float uAudioLow;
uniform float uAudioHistory;

uniform float uTime;

out vec4 oColor;

#define NOISE_ROT_MAT mat3( 0.00,  0.80,  0.60, -0.80,  0.36, -0.48, -0.60, -0.48,  0.64 )

float hash(vec3 p)
{
    p  = fract(p * .3183099 + .1);
	p *= 17.;
    return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}

// https://www.shadertoy.com/view/4sfGzS
float snoise(vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);

    return mix(mix(mix( hash(p+vec3(0,0,0)),
                        hash(p+vec3(1,0,0)),f.x),
                   mix( hash(p+vec3(0,1,0)),
                        hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(p+vec3(0,0,1)),
                        hash(p+vec3(1,0,1)),f.x),
                   mix( hash(p+vec3(0,1,1)),
                        hash(p+vec3(1,1,1)),f.x),f.y),f.z);
}

vec2 norm(in vec2 v) {

    return length(v) == 0. ? vec2(0.) : normalize(v);
}

vec3 norm(in vec3 v) {

    return length(v) == 0. ? vec3(0.) : normalize(v);
}

float fbm(vec2 n, float t)
{
    vec3 q = 4. * vec3(n, 0.) - t;
    float f = 0.;

    f += .5000 * snoise(q); q = NOISE_ROT_MAT * q * 4.01;
    f += .2500 * snoise(q); q = NOISE_ROT_MAT * q * 3.02;
    f += .1250 * snoise(q); q = NOISE_ROT_MAT * q * 2.03;
    f += .0625 * snoise(q); q = NOISE_ROT_MAT * q * 1.01;

	return f;
}

void main()
{
    float t = uTime * .1 + uAudioHistory * .8;
    vec2 p = vUv * vec2(1., uHeight/uWidth) + vec2(0., t * .1);
    float na = fbm(p.xy, t);
    float nb = fbm(p.yx, t);
	float noise = fbm(p.xy + vec2(na, nb), t);
    float osc = sin(t) * .35 + .65;
    float frostyMask = clamp(pow(noise * na * nb, 4. * osc * uAudioLow) * (64. * uAudioLow), 0., 1.);

    vec2 texel = vec2(1. / uWidth, 1. / uHeight);

    // random rgb scatter
    vec2 scatterStrength =  texel * (1. + 50. * uAudioVolume);
    vec3 blur = vec3(

        texture(uBlurTexture, vUv + (noise - .5) * scatterStrength).b,
        texture(uBlurTexture, vUv + (na - .5) * scatterStrength).g,
        texture(uBlurTexture, vUv + (nb - .5) * scatterStrength).r
    );

    vec3 particleRender = texture(uParticleRenderTexture, vUv).rgb ;

    vec3 frosty = blur * 2.2 + .06;
    vec3 col = mix(frosty, particleRender, frostyMask);

    col = clamp(col, 0., 1.);

    oColor = vec4(col, 1.);
}