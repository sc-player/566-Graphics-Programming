attribute vec4 a_Position;
attribute vec2 a_TexCoord;
uniform mat4 u_View;
uniform mat4 u_Proj;
uniform mat4 u_NormalMatrix;
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec4 vPosition;

void main(){
  vPosition = u_View*a_Position;
  gl_Position = u_Proj*vPosition;
  vTexCoord=a_TexCoord;
  vNormal = mat3(u_NormalMatrix) * vec3(0, 1, 0);
}
