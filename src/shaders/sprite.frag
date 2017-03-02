#version 300 es
precision mediump float;
uniform sampler2D u_image;
in vec2 v_texCoord;
in vec4 v_color;
out vec4 fragmentColor;
void main(void) {
    vec4 color1 = texture(u_image, v_texCoord);

    fragmentColor = v_color * color1;
}