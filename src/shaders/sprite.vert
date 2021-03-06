#version 300 es
in vec2 vertex;
in vec2 texCoord;
in mat3 instanceMatrix;
in vec4 instanceTextureQuad;
in vec4 instanceColor;
out vec2 v_texCoord;
out vec4 v_color;
out vec4 v_textureQuad;
uniform mat3 u_projection;

void main(void) {
	vec3 units = instanceMatrix * vec3(vertex, 1);
	gl_Position = vec4(u_projection * units, 1);
	v_texCoord = texCoord;
	v_color = instanceColor;
	v_textureQuad = instanceTextureQuad;
}