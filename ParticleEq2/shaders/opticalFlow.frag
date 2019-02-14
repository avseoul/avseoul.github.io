#version 300 es

precision lowp float;
precision lowp int;

uniform sampler2D uPrevVideo;
uniform sampler2D uCurrVideo;

uniform float uThreshold;
uniform float uBlurRadius;

in vec2 vUv;

out vec4 oColor;

void main() {

    vec2 uv = vUv;

    vec3 sdiff = texture(uCurrVideo, uv).rgb - texture(uPrevVideo, uv).rgb;
         
    float off = uBlurRadius;
    
    vec3 gradx = texture(uPrevVideo, uv + vec2(off, 0.)).rgb - texture(uPrevVideo, uv - vec2(off, 0.)).rgb;
    gradx += texture(uCurrVideo, uv + vec2(off, 0.)).rgb - texture(uCurrVideo, uv - vec2(off, 0.)).rgb;
    
    vec3 grady = texture(uPrevVideo, uv + vec2(0., off)).rgb - texture(uPrevVideo, uv - vec2(0., off)).rgb;
    grady += texture(uCurrVideo, uv + vec2(0., off)).rgb - texture(uCurrVideo, uv - vec2(0., off)).rgb;

    vec3 gradmag = sqrt(gradx * gradx + grady * grady);
    vec3 vx = sdiff * (gradx / gradmag);
    vec3 vy = sdiff * (grady / gradmag);

    vec2 optf = vec2(0);
    optf.x = -(vx.r + vx.g + vx.b) / 3.;
    optf.y = -(vy.r + vy.g + vy.b) / 3.;

    float strength = length(optf);
    if (strength * uThreshold > 0.0) {

        if (strength < uThreshold) {

            optf = vec2(0.0);

        } else {

            strength = (strength - uThreshold) / (1.0 - uThreshold);
            optf = normalize(optf) * vec2(strength);
        }
    }
    
    oColor = vec4(optf, 0., 1.);
}