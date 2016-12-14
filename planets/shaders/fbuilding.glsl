precision mediump float;
uniform samplerCube u_Image;
uniform vec3 u_ALightColor;
uniform vec3 u_DLightColor;
uniform vec3 u_LightDir;
varying vec3 vTexCoords;
varying vec4 vPosition;
varying vec3 vNorm;

void main(){
  vec3 dLight = u_DLightColor * max(dot(vNorm, normalize(u_LightDir)), 0.0);
  vec3 light = u_ALightColor + dLight;
  vec4 Color = textureCube(u_Image, vTexCoords);
  gl_FragColor = vec4(Color.rgb * light, Color.a);
}
