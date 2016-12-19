precision mediump float;
uniform sampler2D u_Image;
uniform vec3 u_ALightColor;
uniform vec3 u_DLightColor;
uniform vec3 u_LightDir;
uniform vec3 u_LightPos[2];
uniform vec3 u_LightCol[2];
uniform int u_LEnabled[2];
varying vec2 vTexCoord;
varying vec4 vPos;

void main(){
  vec4 col = texture2D(u_Image, vTexCoord);
  vec3 dLight = u_DLightColor * max(dot(vec3(0, 1, 0), normalize(u_LightDir)), 0.0);
  vec3 pLight = vec3(0,0,0);
  vec3 direction;
  for(int i=0; i<2; ++i){
    if(u_LEnabled[i]>0){
      direction = normalize(u_LightPos[i]-vec3(vPos));
      pLight += u_LightCol[i] * max(dot(direction, vec3(0, 1, 0)), 0.0);
    }
  }
  vec3 light = u_ALightColor + dLight + pLight;
  gl_FragColor = vec4(col.rgb * light, col.a);
}
