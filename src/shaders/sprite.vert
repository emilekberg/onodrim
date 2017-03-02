#version 300 es
in vec2 a_vertex;
in vec2 a_texCoord;
in vec4 a_color;
in mat3 a_matrix;
out vec2 v_texCoord;
out vec4 v_color;
uniform vec2 u_size;
uniform vec2 u_resolution;

void main(void) {
    vec3 units = a_matrix * vec3(a_vertex, 1);
    units.x /= u_resolution.x;
    units.y /= u_resolution.y;

    vec3 zeroToTwo = units * 2.0;
    vec3 clipSpace = zeroToTwo - 1.0;
    clipSpace.y *= -1.0;

    gl_Position = vec4(clipSpace, 1);
    v_texCoord = a_texCoord;
    v_color = a_color;
}