//Keep track of texture units.
var texUnits=[];
var textures={};
/**
 * Returns the first unused texture unit.
 *
 * @return (int) The index of the first unused texture unit.
 */
function getNewTexUnit(){
  for(j=0; j<16; ++j){
    if(!texUnits[j]){
      texUnits[j]=true;
      return j;
    }
  }
}

function activateTexUnit(tex){
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(tex.unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
}

/**
 * Begins asynchronous loading of texture.
 *
 * @param (string) texName Filename of image.
 * @param (Object) object Object to add texture to.
 */
function loadTexture(texName, object){
  
 /**
  * Creates texture when image is loaded, initializes the texture, and adds it 
  * to the object.
  *
  * @param (Object) obj Object to add texture to.
  * @param (int) uni Texture unit index.
  * @param (Image) img Image object that was loaded.
  */
  function newTexture(obj, name, img){
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    tex.image=img;
    tex.loaded=true;
    textures[name]=tex;
    obj["checkObjLoaded"]();
  }
  var image = new Image();
  image.src=imageDir+texName;
  image.onLoad = newTexture(object, texName, image);
}
