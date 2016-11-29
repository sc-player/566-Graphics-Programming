precision mediump float;
varying vec3 vTexCoords;
uniform samplerCube u_Image;

void main(){
  gl_FragColor = textureCube(u_Image, vTexCoords);
}
