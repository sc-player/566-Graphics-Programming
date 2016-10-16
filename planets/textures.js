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

function checkTexLoaded(texture){
  return texLoaded[texture.unitIndex];
}

function setTexture(object, texture){
  gl.activeTexture(texture.unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  setUniform(object.u_Image, texture.unit);
}

function loadTexture(texName){
  res = gl.createTexture();
  res.image = new Image();
  res.unitIndex=getNewTexUnit();
  res.unit = gl["TEXTURE"+res.unitIndex];
  res.image.onload = function(tex, src){handleLoadedTexture(tex, src);}(res, imageDir+texName);
  res.image.src=imageDir + texName;
  return res;
}

function handleLoadedTexture(texture, src){
  texture.image.src=src;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, null);
  texLoaded[texture.unitIndex]=true;
}

