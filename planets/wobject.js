var WObject = function(name){
  this.json = JSON.parse(loadExternalFile(objDir+name+".json"));
  this.vshader= this.json.vshader;
  this.fshader= this.json.fshader;
  this.blend=this.json.blend;
  this.drawType=gl[this.json.drawType];
  this.objs = this.json.objects;
  this.shaderVars=new ShaderVars(this.json.vars, this.objs);
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);
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

WObject.prototype.draw = function(){
  var pointLength = this.shaderVars.setAllShaderVars(this);
  if(this.textured){
    var tex=textures[this.getCurrentTexture()];
    gl.activeTexture(tex.unit);
    gl.bindTexture((tex.cube) ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D, tex);
  }
  if(this.shaderVars.elementBuffer)  gl.drawElements(
    this.drawType, Object3d.prototype[this.objs[0]].length, gl.UNSIGNED_BYTE, 0
  );
  else gl.drawArrays(this.drawType, 0, 
    pointLength/this.shaderVars.a_Position.size
  );
};

WObject.prototype.getCurrentTexture = function(){
  return this.textures[0];
};

WObject.prototype.checkObjLoaded = function(){
  if(!this.textured) return;
  else{
    this.textures.forEach(function(val){
      if(typeof textures[val] ==='undefined' || !textures[val].loaded){
        this.loaded=false;
        return;
      }
    }, this);
    this.loaded=true;
  }
};

WObject.prototype.releaseTextureUnits = function(){
  if(typeof this.cubeTexture !== 'undefined'){
    texUnits[textures[this.cubeTexture].unit-gl.TEXTURE0]=false; 
  } else {
    this.textures.forEach(function(val){
      texUnits[textures[val].unit-gl.TEXTURE0]=false;
    });
  }
};

WObject.prototype.gatherTextureUnits = function(){
  if(typeof this.cubeTexture !== 'undefined'){
    activateTexUnit(this.program, this.cubeTexture);
  } else {
    this.textures.forEach(function(val){
      activateTexUnit(this.program, val);
    }, this);
  }
};
