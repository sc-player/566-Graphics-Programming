precision mediump float;
uniform sampler2D u_Image;
uniform vec3 u_ALightColor;
uniform vec3 u_DLightColor;
uniform vec3 u_LightDir;
varying vec2 vTexCoord;
varying vec3 vNormal;

void main(){
  vec3 light = u_ALightColor + u_DLightColor * max(dot(normalize(vNormal), normalize(u_LightDir)), 0.0);
  vec4 col = texture2D(u_Image, vTexCoord);
  gl_FragColor = vec4(col.rgb * light, col.a);
}
