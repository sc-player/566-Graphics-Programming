precision mediump float; 
varying vec4 vColor;       //Color
uniform vec4 uColor;
uniform int uni;

//Main: Sets color of each star.
void main(){
  if(uni>0) gl_FragColor = uColor;
  else gl_FragColor = vColor;
}

