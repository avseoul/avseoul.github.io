/************************************************
 *
 *  PS_01_shaders
 ************************************************/
<script type='x-shader/x-vertex' id='PS_01_vert'>
float turbulence( vec3 p ) {
    float w = 100.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}

varying vec2 vUv;
varying float noise;
varying vec4 vColor;
varying vec3 vPos;

void main(){
    vUv = uv;
    vColor = vec4(1.0, 1.0, 1.0, 1.0);

    noise = 10.0 * -0.10 * turbulence( 0.5 * normal );
    float b = 5.0 * pnoise( 0.05 * position, vec3( 100.0 ));
    float displacement = -10.0 * noise + b;
    vPos = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
    gl_PointSize = turb;
}
</script>
<script type='x-shader/x-vertex' id='PS_01_frag'>
varying vec4 vColor;
varying vec3 vPos;

void main(){
    float alpha = 1.0;
    gl_FragColor = vec4( vColor.rgb, alpha );
}
</script>
