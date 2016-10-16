attribute vec4 a_Position;
attribute vec2 a_TexCoord;
uniform mat4 u_Model;
varying vec2 vTexCoord;

void main(){
  gl_Position = a_Position * u_Model;
  vTexCoord=a_TexCoord;
}
