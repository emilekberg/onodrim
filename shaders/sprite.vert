attribute vec2 a_vertex;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
uniform vec2 u_size;
uniform vec2 u_resolution;

/*void main() {
    gl_Position = vec4(a_vertex, 0.0, 1.0);
    v_texCoord = vec2(a_texCoord.s, 1.0 - a_texCoord.t);
}*/

void main(void) {
    vec2 zeroToOne = (a_vertex) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    clipSpace.y *= -1.0;

    //gl_Position = a_vertex;
    gl_Position = vec4(clipSpace, 1, 1);
    v_texCoord = a_texCoord;
}
/*
void main(void) {
    vec2 pos = (a_matrix * vec3(a_vertex, 1)).xy;
    vec2 position = (a_matrix * vec3(a_vertex , 1)).xy;
    //vec2 position = (vec3(a_vertex * a_size, 1)).xy;
    vec2 zeroToOne = (position) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;


    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

    v_texCoord = a_texCoord;
    //gl_Position = vec4(a_vertex,1, 0, 1);
}
*/
