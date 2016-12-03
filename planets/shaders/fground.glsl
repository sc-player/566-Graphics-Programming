precision mediump float;
uniform sampler2D u_Image;
varying vec2 vTexCoord;
varying float vDot;

void main(){
  vec4 col = texture2D(u_Image, vTexCoord);
  gl_FragColor = vec4(col.xyz * vDot, col.a);
}
