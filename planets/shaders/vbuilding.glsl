attribute vec4 a_Position;
attribute vec4 a_Normal;
uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Proj;
uniform mat4 u_NormalMatrix;
varying vec4 vPosition;
varying vec3 vTexCoords;
varying vec3 vNorm;

void main(){
  vPosition = u_Model*a_Position;
  gl_Position = u_Proj*u_View*vPosition;
  vTexCoords = vec3(-a_Position.x, -a_Position.y, -a_Position.z);
  vNorm = normalize(vec3(u_NormalMatrix * a_Normal));
}
