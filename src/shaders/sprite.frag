#version 300 es
precision mediump float;
uniform sampler2D u_image;
in vec2 v_texCoord;
in vec4 v_color;
in vec4 v_textureQuad;
out vec4 fragmentColor;
void main(void) {
    vec2 coord = vec2(v_texCoord);
    coord.xy *= v_textureQuad.zw;
    coord.xy += v_textureQuad.xy;
    vec4 color1 = texture(u_image, coord);
    fragmentColor = v_color * color1;
}