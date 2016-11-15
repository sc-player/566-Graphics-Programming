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

function activateTexUnit(uni, text){
  var tex=textures[text];
  tex.unit=gl["TEXTURE"+getNewTexUnit()]; 
  uni.data=tex.unit-gl.TEXTURE0;
  gl.bindTexture((tex.cube) ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D, tex);
  if(tex.cube){
    for(i=0; i<tex.images.length; ++i){
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.images[i]); 
    }
  }
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
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
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
  image.onload = function(){newTexture(texName, image, object);};
}
 
function loadCubeMap(texName, texNames, object){ 
 /**
  * Creates texture when image is loaded, initializes the texture, and adds it 
  * to the object.
  *
  * @param (Object) obj Object to add texture to.
  * @param (int) uni Texture unit index.
  * @param (Image) img Image object that was loaded.
  */
  function newCubeMap(obj, name, names, img, i){
    if(!textures[name]){
      tex = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST); 
      tex.images=[];
      tex.cube=true;
      textures[name]=tex;
    } else{
      tex=textures[name];
    }
    tex.images[i]=img;
    if(tex.images.length>5){
      tex.loaded=true;
      obj["checkObjLoaded"]();
    }
  }
  var i=0;
  texNames.forEach(function(val){
    var image = new Image();
    image.src=imageDir+val;
    image.onload = function(){
      newCubeMap(object, texName, texNames, image, i); 
      ++i;
    };
  });
}
