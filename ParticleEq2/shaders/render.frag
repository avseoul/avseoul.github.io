#version 300 es

precision highp float;
precision highp int;

#define LIGHT_A vec3(100., 100., 100.)

#define DIFFUSE_INTENSITY .6
#define SPECULAR_INTENSITY .02   
#define AMBIENT_INTENSITY .0001

in vec2 vUv;
in vec3 vInstanceColors;
in float vInstanceIndices;
in vec4 vInstancePositions;
in vec4 vInstanceVelocities;
in vec3 vWorldPos;
in vec3 vWorldNormal;

uniform vec3 uWorldcCamPos;

uniform sampler2D uNormalMap;

out vec4 oColor;

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

vec3 calcPhong(in vec3 lightDir, in vec3 viewDir, in vec3 norm, in vec3 diffuseCol, in vec3 specularCol) {

    vec3 reflectDir = reflect(lightDir, norm);

    float lambertian = clamp(dot(lightDir, norm), 0., 1.);
    float specular = pow(clamp(dot(reflectDir, viewDir), 0., 1.), 4.);

    return DIFFUSE_INTENSITY * diffuseCol * lambertian + SPECULAR_INTENSITY * specularCol * specular;
}

void main() {

    vec3 diffCol = pow(length(vInstanceVelocities.xyz), 5.) * .001 * normalize(vInstanceVelocities.xyz);//* vInstanceColors;
    vec3 specCol = vec3(1.);

    vec3 normal = vWorldNormal;
    vec3 lightDir = normalize(LIGHT_A - vWorldPos);
    vec3 viewDir = normalize(vWorldPos - uWorldcCamPos);

#ifdef TANGENT_SPACE

    mat3 tbn = calcTBNMatrix(vWorldPos, vUv, vWorldNormal);

    // http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/
    normal = normalize(texture(uNormalMap, vUv).rgb * 2. - 1.);
    lightDir = tbn * lightDir;
    viewDir = tbn * viewDir;
#endif

    vec3 brdf = vec3(0.);
    brdf += AMBIENT_INTENSITY 
        + pow((vInstancePositions.w - 1.), 2.) * .23;
    brdf += calcPhong(lightDir, viewDir, normal, diffCol, specCol);
    
    vec3 col = brdf;
    float alpha = 1.;

    col = pow(col, vec3(.45));

    // col.rg = vUv;
    // col.b = 0.;
    // col.rgb = normal;

    oColor = vec4(col, alpha);
}