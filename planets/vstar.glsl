//Inputs
attribute vec4 a_Position;   //Absolute Position
attribute float a_Size;      //Size
attribute vec4 a_Color;      //Color
uniform vec4 u_Translation;  //Camera offset

//Outputs
varying vec4 vColor;

//Main: Sets position and size, and sets the output color.
void main() {
  gl_Position = a_Position + u_Translation;
  gl_PointSize = a_Size;
  vColor = a_Color;
}

