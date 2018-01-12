var blob_frag = 
`
varying float v_noise;

#if defined(IS_POINTS)
  uniform sampler2D tex_sprite;
#endif

#if defined(HAS_CUBEMAP)
  uniform samplerCube cubemap;
#endif

#if defined(IS_PBR)
  uniform sampler2D tex_normal;
  uniform sampler2D tex_roughness;
  uniform sampler2D tex_metallic;
  uniform float u_normal;
  uniform float u_roughness;
  uniform float u_metallic;
  uniform float u_exposure;
  uniform float u_gamma;

  #define PI 3.1415926535897932384626433832795

  // Filmic tonemapping from
  // http://filmicgames.com/archives/75
  const float A = 0.15;
  const float B = 0.50;
  const float C = 0.10;
  const float D = 0.20;
  const float E = 0.02;
  const float F = 0.30;

  vec3 Uncharted2Tonemap( vec3 x )
  {
    return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
  }

  // https://www.unrealengine.com/blog/physically-based-shading-on-mobile
  vec3 EnvBRDFApprox( vec3 SpecularColor, float Roughness, float NoV )
  {
    const vec4 c0 = vec4( -1, -0.0275, -0.572, 0.022 );
    const vec4 c1 = vec4( 1, 0.0425, 1.04, -0.04 );
    vec4 r = Roughness * c0 + c1;
    float a004 = min( r.x * r.x, exp2( -9.28 * NoV ) ) * r.x + r.y;
    vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
    return SpecularColor * AB.x + AB.y;
  }


  // http://the-witness.net/news/2012/02/seamless-cube-map-filtering/
  vec3 fix_cube_lookup( vec3 v, float cube_size, float lod ) {
    float M = max(max(abs(v.x), abs(v.y)), abs(v.z));
    float scale = 1. - exp2(lod) / cube_size;
    if (abs(v.x) != M) v.x *= scale;
    if (abs(v.y) != M) v.y *= scale;
    if (abs(v.z) != M) v.z *= scale;
    return v;
  }

  // Normal Blending
  // Source adapted from http://blog.selfshadow.com/publications/blending-in-detail/
  vec3 blendNormalsUnity( vec3 baseNormal, vec3 detailsNormal )
  {
      vec3 n1 = baseNormal;
      vec3 n2 = detailsNormal;
      mat3 nBasis = mat3(
          vec3(n1.z, n1.y, -n1.x), // +90 degree rotation around y axis
          vec3(n1.x, n1.z, -n1.y), // -90 degree rotation around x axis
          vec3(n1.x, n1.y,  n1.z));
      return normalize(n2.x*nBasis[0] + n2.y*nBasis[1] + n2.z*nBasis[2]);
  }
  vec3 blendNormals( vec3 n1, vec3 n2 )
  {
    return blendNormalsUnity( n1, n2 );
  }
#endif


void main(){
	float m_noise = v_noise;
	float m_noise_inv = 1.-v_noise;

  vec3 m_diffuse = vec3(0.);
  m_diffuse.r += m_noise_inv + m_noise;
  m_diffuse.g += m_noise*1.5;
  //m_diffuse.b += m_noise;
  m_diffuse -= pow(1.-m_noise, 4.)*.95; //<- darken peak
  m_diffuse = clamp(m_diffuse, vec3(0.), vec3(2.));

  vec3 m_col = m_diffuse;

#if defined(IS_PBR)
  vec3 N = normalize( vWsNormal );
  N = blendNormals( N, texture2D( tex_normal, uv ).xyz );

  vec3 V = normalize( vEyePosition );
  //vec3 V = normalize( -vWsPosition.xyz );

  // Light direction
  vec3  L = normalize( uLightPos - vPosition.xyz );
  // Surface reflection vector
  vec3  R = normalize( -reflect( L, N ) );
  
  // sample the roughness and metallic textures
  float roughnessMask = texture2D( tex_roughness, uv ).r;
  float metallicMask  = texture2D( tex_metallic, uv ).r;
  
  // deduce the diffuse and specular color from the baseColor and how metallic the material is
  vec3 diffuseColor = m_diffuse - m_diffuse * u_metallic * metallicMask;
  vec3 specularColor  = mix( vec3( 0.08 * uSpecular ), m_diffuse, u_metallic * metallicMask );

  vec3 m_col;
  
  // sample the pre-filtered cubemap at the corresponding mipmap level
  int numMips     = 6;
  float mip     = numMips - 1 + log2( u_roughness * roughnessMask );
  vec3 lookup     = -reflect( V, N );
  vec3 radiance   = pow( textureLod( cubemap, fix_cube_lookup( lookup, uRadianceMapSize, mip ), mip ).ggg, vec3( 2.2f ) );
  vec3 irradiance   = pow( texture2D( cubemap, fix_cube_lookup( N, uIrradianceMapSize, 0 ) ).ggg, vec3( 2.2f ) );


  // get the approximate reflectance
  float NoV     = saturate( dot( N, V ) );
  vec3 reflectance  = EnvBRDFApprox( specularColor, pow( u_roughness * roughnessMask, 4.0 ), NoV );

  // combine the specular IBL and the BRDF
  float vel_mag = length(v_vel);
    vec3 diffuse  = diffuseColor * irradiance;
    vec3 specular = radiance * reflectance;
  m_col = diffuse + specular;

  // add noise diffuse
  m_col += m_diffuse;
  
  // apply the tone-mapping
  m_col       = Uncharted2Tonemap( m_col * u_exposure );
  // white balance
  m_col       = m_col * ( 1.0f / Uncharted2Tonemap( vec3( 20.0f ) ) );
  
  // gamma correction
  m_col       = pow( m_col, vec3( 1.0f / u_gamma ) );
#endif

#if defined(IS_WIRE)
  m_col.r = 1. - m_col.r;
  m_col *= .2 * m_noise;
#endif 

  gl_FragColor = vec4(m_col, 1.);

#if defined(IS_POINTS)
  gl_FragColor *= texture2D(tex_sprite, gl_PointCoord);
#endif
}
`