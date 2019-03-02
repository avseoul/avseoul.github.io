#version 300 es

precision highp float;
precision highp int;

#define LIGHT_FILL vec3(-100., -100., -100.)
#define LIGHT_BACK vec3(0., -100., 0.)

in vec2 vUv;
in vec3 vInstanceColors;
in vec2 vInstanceTexCoords;
in float vInstanceIndices;
in vec4 vInstancePositions;
in vec4 vInstanceVelocities;
in vec3 vWorldPos;
in vec3 vWorldNormal;
in vec4 vShadowCoord;

uniform float uIsShadowPass;

uniform float uAmbient;
uniform float uDiffuse;
uniform float uFill;
uniform float uBack;
uniform float uFresnel;
uniform float uGamma;
uniform float uisBW;

uniform float uAudioVolume;
uniform float uAudioHigh;
uniform float uAudioMiddle;
uniform float uAudioLow;
uniform float uAudioHistory;

uniform vec3 uWorldcCamPos;
uniform vec3 uWorldMainLightPos;

uniform sampler2D uNormalMap;
uniform sampler2D uShadowMap;

uniform samplerCube uCubeMap;

out vec4 oColor;

float hash(vec4 seed) {

    float p = dot(seed, vec4(12.9898,78.233,45.164,94.673));

    return fract(sin(p) * 43758.5453);
}

// https://gamedev.stackexchange.com/a/86543
// get tangent space matrix from world pos / normal
mat3 calcTBNMatrix(in vec3 p, in vec2 uv, in vec3 N) {

    // get edge vectors of the pixel triangle
    vec3 dp1 = dFdx( p );
    vec3 dp2 = dFdy( p );
    vec2 duv1 = dFdx( uv );
    vec2 duv2 = dFdy( uv );

    // solve the linear system
    vec3 dp2perp = cross( dp2, N );
    vec3 dp1perp = cross( N, dp1 );
    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;

    // construct a scale-invariant frame
    float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
    return mat3( T * invmax, B * invmax, N );
}

// http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-16-shadow-mapping/
float calcShadow() {

    vec3 shadowCoord = (vShadowCoord.xyz / vShadowCoord.w) * .5 + .5;

    const float bias = .001;
    const vec2 poissonDisk[4] = vec2[](

        vec2(-.94201624, -.39906216),
        vec2(.94558609, -.76890725),
        vec2(-.094184101, -.92938870),
        vec2(.34495938, .29387760)
    );

    float shadow = 1.;

    for (int i = 0; i < 4; i++) {

        int index = int(16. * hash( vec4(gl_FragCoord.xyy, i) )) % 16;

        if ( texture( uShadowMap, shadowCoord.xy + poissonDisk[index] / 700. ).r  <  shadowCoord.z - bias ){

            shadow -=  .05;
        }
    }

    return shadow;
}

void main() {

    if(uIsShadowPass > .5) {

        return;
    }

    vec3 normal = vWorldNormal;
    vec3 mainLightDir = normalize(uWorldMainLightPos - vWorldPos);
    vec3 lightDir_FILL = normalize(LIGHT_FILL - vWorldPos);
    vec3 lightDir_BACK = normalize(LIGHT_BACK - vWorldPos);
    vec3 viewDir = normalize(vWorldPos - uWorldcCamPos);

#ifdef TANGENT_SPACE

    mat3 tbn = calcTBNMatrix(vWorldPos, vUv, vWorldNormal);

    // http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/
    normal = normalize(texture(uNormalMap, vUv).rgb * 2. - 1.);

    mainLightDir = tbn * mainLightDir;
    lightDir_FILL = tbn * lightDir_FILL;
    lightDir_BACK = tbn * lightDir_BACK;

    viewDir = tbn * viewDir;
#endif

    float ambient = .2 + .8 * normal.y;
    float diffuse = max(dot(normal, mainLightDir), 0.);
    float fill = max(dot(normal, lightDir_FILL), 0.);
    float back = max(dot(-normal, lightDir_BACK), 0.);
    float fresnel = pow(clamp(1. + dot(normal, viewDir), 0., 1.), 1.);
    float occ = 1.; // temp
    float shadow = calcShadow();

    vec3 col = vInstanceColors;// + uAudioVolume;// * webcam; 

    float noiseIllum = pow(vInstancePositions.w, 2.);
    col += noiseIllum * .3;
    noiseIllum = min(noiseIllum * length(vInstanceVelocities.xyz), 20.); 

    vec3 brdf = vec3(0.);

    // cubemap reflection
    vec3 refl = texture(uCubeMap, reflect(viewDir, normal)).rgb * (pow(fresnel, .45) * .7 + .3);
    brdf += refl * occ * shadow;

    brdf += uAmbient * ambient * (uisBW > .5 ? col : col * normalize(vInstanceVelocities.xyz)) * occ * shadow;
    brdf += uDiffuse * diffuse * col * occ * shadow;
    brdf += uFill * fill * col * occ * shadow;
    brdf += uBack * back * col * occ * shadow;
    brdf += uFresnel * fresnel * (uisBW > .5 ? col : col * normalize(1.-vInstanceVelocities.xyz)) * occ * shadow;

    // illum effect
    brdf += (.02 * noiseIllum) * occ * shadow;

    float alpha = 1.;

    brdf = pow(brdf, vec3(uGamma));

    oColor = vec4(brdf, alpha);
}