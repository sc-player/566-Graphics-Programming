var texUnits=[];
var texLoaded=[];

function getNewTexUnit(){
  for(j=0; j<16; ++j){
    if(!texUnits[j]){
      texUnits[j]=true;
      texLoaded[j]=false;
      return j;
    }
  }
}

function loadTexture(texName, object){
  function newTexture(obj, uni, img){
    tex = gl.createTexture();
    tex.unit = gl["TEXTURE"+uni];
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    tex.image=img;
    texLoaded[uni]=true;
    obj.textures[uni]=tex;
    obj["checkObjLoaded"]();
  }
  var unit = getNewTexUnit();
  gl.activeTexture(gl["TEXTURE"+unit]);
  var image = new Image();
  image.src=imageDir+texName;
  image.onLoad = newTexture(object, unit, image);
}
