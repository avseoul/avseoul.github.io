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
    vec3 q = 24. * vec3(n, 0.) - t;
    float f = 0.;

    f += .5000 * snoise(q); q = NOISE_ROT_MAT * q * 4.01;
    f += .2500 * snoise(q); q = NOISE_ROT_MAT * q * 3.02;
    f += .1250 * snoise(q); q = NOISE_ROT_MAT * q * 2.03;
    f += .0625 * snoise(q); q = NOISE_ROT_MAT * q * 1.01;

	return f;
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