attribute vec4 a_Position;
attribute float a_Size;      
attribute vec4 a_Color;      
uniform mat4 u_Model;  
varying vec4 vColor;

void main() {
  gl_Position = u_Model * a_Position;
  gl_PointSize = a_Size;
  vColor = a_Color;
}

