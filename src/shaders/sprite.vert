#version 300 es
in vec2 vertex;
in vec2 texCoord;
in vec4 instanceTextureQuad;
in vec4 instanceColor;
in mat3 instanceMatrix;
out vec2 v_texCoord;
out vec4 v_color;
out vec4 v_textureQuad;
uniform vec2 u_size;
uniform vec2 u_resolution;

void main(void) {
    vec3 units = instanceMatrix * vec3(vertex, 1);
    units.x /= u_resolution.x;
    units.y /= u_resolution.y;

    vec3 zeroToTwo = units * 2.0;
    vec3 clipSpace = zeroToTwo - 1.0;
    clipSpace.y *= -1.0;

    gl_Position = vec4(clipSpace, 1);
    v_texCoord = texCoord;
    v_color = instanceColor;
    v_textureQuad = instanceTextureQuad;
}