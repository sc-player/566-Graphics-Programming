attribute vec4 a_Position;
uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Proj;
varying vec3 vTexCoords;

void main(){
  gl_Position = u_Proj*u_View*u_Model*a_Position;
  vTexCoords = vec3(-a_Position.x, -a_Position.y, -a_Position.z);
}
