attribute vec4 a_Position;
attribute vec2 a_TexCoord;
uniform mat4 u_View;
uniform mat4 u_Proj;
varying vec2 vTexCoord;

void main(){
  gl_Position = u_Proj*u_View*a_Position;
  vTexCoord=a_TexCoord;
}
