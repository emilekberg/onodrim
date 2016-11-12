precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;

void main(void) {
    //vec4 sample = texture2D(u_image, u_texCoordOffset.xy + (v_texCoord * u_texCoordOffset.zw));
    vec4 sample = texture2D(u_image, v_texCoord);

    //gl_FragColor = vec4(1,0,0,1);
    gl_FragColor = sample;//vec4(sample.xyz, sample.a);
}