attribute vec4 a_Position;
attribute vec2 a_TexCoord;
uniform vec4 u_Translation;

varying vec2 vTexCoord;
void main(){
  gl_Position=a_Position + u_Translation;
  vTexCoord=a_TexCoord;
}
