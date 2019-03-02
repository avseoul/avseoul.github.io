#version 300 es

precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D uSrcTexture;

uniform vec2 uDir;

uniform float uWidth;
uniform float uHeight;

out vec4 oColor;

#define SAMPLE 16
#define SIGMA 4. //sqrt(float(samples));
#define PI 3.14159265

// https://www.shadertoy.com/view/ltBcDm
float calcGaussian(float x) 
{
    return (1.0 / sqrt(2.0 * PI * SIGMA * SIGMA)) * exp(-((x * x) / (2.0 * (SIGMA * SIGMA))));
}

vec3 calcBlur(in sampler2D tex, in vec2 uv, in vec2 texelSize)
{
    vec3 blur = vec3(0.);
    float accum = 0.;

    for(int i = -SAMPLE / 2; i < SAMPLE / 2; i++)
    {
        float weight = calcGaussian(float(i));
        
        blur += texture(tex, uv + uDir * float(i) * texelSize).rgb * weight;	
        accum += weight;
    }

    return blur / accum;
}

void main() 
{		
    oColor = vec4(calcBlur(uSrcTexture, vUv, vec2(1./uWidth, 1./uHeight) * 2.), 1.);
}