precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
uniform vec4 u_color;

void main(void) {
    gl_FragColor = texture2D(u_image, v_texCoord);
    //gl_FragColor = u_color;
}