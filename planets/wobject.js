/**
 * Philip Strachan
 * wobject.js
 * Generic drawable object.
 */
var WObject = function(name){
  //Parse JSON file
  this.json = JSON.parse(loadExternalFile(objDir+name+".json"));
  this.vshader= this.json.vshader;
  this.fshader= this.json.fshader;
  this.blend=this.json.blend;
  this.drawType=gl[this.json.drawType];
  this.objs = this.json.objects;

  //Create ShaderVars
  this.shaderVars=new ShaderVars(this.json.vars, this);
 
  //Create shader program
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);

  //Load textures.
  if(typeof this.json.textures !== 'undefined'){
    this.loaded=false;
    this.textured=true;
    this.textures=this.json.textures;
    this.textures.forEach(function(val){
      if(val.indexOf(".gif")===-1) loadCubeMap(val, this);
      else loadTexture(val, this);
    }, this);
  } else this.textured=false;
};

//Generic draw functionality.
WObject.prototype.draw = function(v, obj){
  var pointLength = v.setAllShaderVars(this, obj);
  if(this.textured){
    var tex=textures[this.getCurrentTexture()];
    gl.activeTexture(tex.unit);
    gl.bindTexture((tex.cube) ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D, tex);
  }
  if(typeof obj !== 'undefined')    //indexed
    gl.drawElements(this.drawType, pointLength, gl.UNSIGNED_BYTE, 0);
  else gl.drawArrays(               
    this.drawType, 0, pointLength/this.shaderVars.a_Position.size
  );
};

//Return default texture.
WObject.prototype.getCurrentTexture = function(){ 
  return this.textures[0];
};

//Checks to see if all textures are loaded.
WObject.prototype.checkObjLoaded = function(){
  if(!this.textured) return;
  else if(typeof this.textures !== 'undefined'){
    this.textures.forEach(function(val){
      if(typeof textures[val] ==='undefined' || !textures[val].loaded){
        this.loaded=false;
        return;
      }
    }, this);
    this.loaded=true;
  }
};

//Release texture units when not needed.
WObject.prototype.releaseTextureUnits = function(){
  if(typeof this.textures !== 'undefined')
    this.textures.forEach(function(val){
      texUnits[textures[val].unit-gl.TEXTURE0]=false;
    });
  
};

//Send textures to the GPU.
WObject.prototype.gatherTextureUnits = function(){
  if(typeof this.textures !== 'undefined') {
    this.textures.forEach(function(val){
      activateTexUnit(this.program, val);
    }, this);
  }
};
