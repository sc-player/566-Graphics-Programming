precision mediump float;
uniform samplerCube u_Image;
uniform vec3 u_ALightColor;
uniform vec3 u_DLightColor;
uniform vec3 u_LightDir;
varying vec3 vNormal;
varying vec3 vTexCoords;
varying vec4 vPosition;

void main(){
  vec3 light = u_ALightColor + u_DLightColor * max(dot(normalize(vNormal), normalize(u_LightDir)), 0.0);
  vec4 Color = textureCube(u_Image, vTexCoords);
  gl_FragColor = vec4(Color.rgb * light, Color.a);
}
