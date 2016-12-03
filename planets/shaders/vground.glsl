attribute vec4 a_Position;
attribute vec2 a_TexCoord;
uniform mat4 u_View;
uniform mat4 u_Proj;
uniform mat4 u_NormalMatrix;
uniform vec3 u_LightDir;
varying vec2 vTexCoord;
varying float vDot;

void main(){
  gl_Position = u_Proj*u_View*a_Position;
  vTexCoord=a_TexCoord;
  vec4 lvector =  u_NormalMatrix*vec4(0,1,0,1);
  vDot=max(dot(normalize(lvector.xyz), normalize(u_LightDir)), 1.0);
}
