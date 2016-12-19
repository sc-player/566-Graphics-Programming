attribute vec4 a_Position;
attribute vec2 a_TexCoord;
uniform mat4 u_View;
uniform mat4 u_Proj;
varying vec2 vTexCoord;
varying vec4 vPos;

void main(){
  vPos = a_Position;
  gl_Position = u_Proj* u_View * vPos;
  vTexCoord = a_TexCoord;
}
