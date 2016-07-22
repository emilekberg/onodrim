attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
uniform mat3 u_matrix;
void main(void) {
    vec2 position = (u_matrix * vec3(a_position, 1)).xy;
    vec2 zeroToOne = (position) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

    v_texCoord = a_texCoord;
}