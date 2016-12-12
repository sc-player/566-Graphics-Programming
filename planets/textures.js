//Keep track of texture units.
var texUnits=[];
var textures={};
var sides=["-right", "-left", "-up", "-down", "-front", "-back"];
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

function activateTexUnit(uni, text){
  var tex=textures[text];
  var type = (tex.cube) ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
  var edge = (tex.cube) ? gl.CLAMP_TO_EDGE : gl.REPEAT;
  gl.bindTexture(type, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texParameteri(type, gl.TEXTURE_WRAP_S, edge);
  gl.texParameteri(type, gl.TEXTURE_WRAP_T, edge);
  gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST); 
  tex.unit=gl["TEXTURE"+getNewTexUnit()]; 
  uni.data=tex.unit-gl.TEXTURE0;
  if(tex.cube)
    for(i=0; i<sides.length; ++i)
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.images[sides[i]]);  
  else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
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
  function newTexture(name, img, obj){
    tex = gl.createTexture();
    tex.image=img;
    textures[name]=tex;
    tex.loaded=true;
    obj["checkObjLoaded"]();
  }
  var image = new Image();
  image.src=imageDir+texName;
  image.onload = function(){ newTexture(texName, image, object); };
}
 
function loadCubeMap(texName, object){ 
 /**
  * Creates texture when image is loaded, initializes the texture, and adds it 
  * to the object.
  *
  * @param (Object) obj Object to add texture to.
  * @param (int) uni Texture unit index.
  * @param (Image) img Image object that was loaded.
  */
  function newCubeMap(obj, name, side, img, i){
    if(!textures[name]){
      tex = gl.createTexture();
      tex.images={};
      tex.cube=true;
      tex.loaded=false;
      textures[name]=tex;
    } else{
      tex=textures[name];
    }
    tex.images[side]=img;
    if(i>5){
      tex.loaded=true;
      obj["checkObjLoaded"]();
    }
  }
  var i=0;
  sides.forEach(function(val) {
    var image = new Image();
    image.src=imageDir+texName+val+".gif";
    image.onload = function(){
      newCubeMap(object, texName, val, image, i); 
      i++;
    };
  });
}
