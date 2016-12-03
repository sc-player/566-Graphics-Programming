attribute vec4 a_Position;
attribute vec4 a_Normal;
uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Proj;
uniform mat4 u_NormalMatrix;
uniform vec3 u_LightDir;
varying vec3 vTexCoords;
varying float vDot;

void main(){
  gl_Position = u_Proj*u_View*u_Model*a_Position;
  vTexCoords = vec3(-a_Position.x, -a_Position.y, -a_Position.z);
  vec4 lvector = u_NormalMatrix * a_Normal;
  vDot = max(dot(normalize(lvector.xyz), normalize(u_LightDir)), 0.0);
}
