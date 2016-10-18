//Keep track of texture units.
var texUnits=[];
var texLoaded=[];

/**
 * Returns the first unused texture unit.
 *
 * @return (int) The index of the first unused texture unit.
 */
function getNewTexUnit(){
  for(j=0; j<16; ++j){
    if(!texUnits[j]){
      texUnits[j]=true;
      texLoaded[j]=false;
      return j;
    }
  }
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
