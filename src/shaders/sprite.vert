attribute vec2 a_vertex;
attribute vec2 a_texCoord;
attribute vec4 a_color;
attribute mat3 a_matrix;
varying vec2 v_texCoord;
varying vec4 v_color;
uniform vec2 u_size;
uniform vec2 u_resolution;

/*void main() {
    gl_Position = vec4(a_vertex, 0.0, 1.0);
    v_texCoord = vec2(a_texCoord.s, 1.0 - a_texCoord.t);
}*/

void main(void) {
    vec3 units = a_matrix * vec3(a_vertex, 1);
    units.x /= u_resolution.x;
    units.y /= u_resolution.y;

    // vec2 zeroToOne = (a_vertex / u_resolution) ;/// u_resolution;
    vec3 zeroToTwo = units * 2.0;
    vec3 clipSpace = zeroToTwo - 1.0;
    clipSpace.y *= -1.0;
    mat3 mat = a_matrix;
    //gl_Position = a_vertex;
    gl_Position = vec4(clipSpace, 1);
    v_texCoord = a_texCoord;
    v_color = a_color;
}