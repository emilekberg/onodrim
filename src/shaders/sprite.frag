precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    //vec4 sample = texture2D(u_image, u_texCoordOffset.xy + (v_texCoord * u_texCoordOffset.zw));
    vec4 sample = texture2D(u_image, v_texCoord);

    //gl_FragColor = v_color;
    gl_FragColor = sample + v_color; // (sample + v_color);//vec4(sample.xyz, sample.a);
}