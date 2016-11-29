attribute vec4 a_Position;
attribute vec2 a_TexCoords;
uniform mat4 u_Model;
varying vec2 vTexCoord;

void main(){
  gl_Position = u_Model*a_Position;
  vTexCoord=a_TexCoords;
}
