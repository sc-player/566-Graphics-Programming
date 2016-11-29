precision mediump float;
uniform sampler2D u_Image;
varying vec2 vTexCoord;

void main(){
  gl_FragColor = texture2D(u_Image, vTexCoord);
}
