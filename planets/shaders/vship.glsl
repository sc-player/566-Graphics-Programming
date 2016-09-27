attribute vec4 a_Position;
uniform mat4 u_Model;

void main(){
  gl_Position = a_Position * u_Model;
}
