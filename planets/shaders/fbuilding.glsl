precision mediump float;
uniform samplerCube u_Image;
uniform vec3 u_ALightColor;
uniform vec3 u_DLightColor;
uniform vec3 u_LightDir;
uniform vec3 u_LightPos[2];
uniform vec3 u_LightCol[2];
uniform int u_LEnabled[2];
varying vec3 vTexCoords;
varying vec4 vPosition;
varying vec3 vNorm;

void main(){
  vec4 Color = textureCube(u_Image, vTexCoords);
  vec3 dLight = Color.rgb * u_DLightColor * max(dot(vNorm, normalize(u_LightDir)), 0.0);
  vec3 pLight = vec3(0,0,0);
  vec3 direction;
  for(int i=0; i<2; ++i){
    if(u_LEnabled[i]>0){
      direction = normalize(u_LightPos[i]-vec3(vPosition));
      pLight += Color.rgb * u_LightCol[i] * max(dot(direction, vNorm), 0.0);
    }
  }
  vec3 light = u_ALightColor * Color.rgb + dLight + pLight;
  gl_FragColor = vec4(light, Color.a);
}
