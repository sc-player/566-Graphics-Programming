attribute vec4 a_Position;
uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Proj;

void main(){
  gl_Position = u_Proj*u_View*u_Model*a_Position;
}
