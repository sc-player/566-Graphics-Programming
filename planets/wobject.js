var WObject = function(name){
  var obj = JSON.parse(loadExternalFile(objDir+name+".json"));
  this.vshader= obj.vshader;
  this.fshader= obj.fshader;
  this.blend=obj.blend;
  this.drawType=obj.drawType;
  this.shaderVars=new ShaderVars(obj.vars);
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);
  if(typeof obj.textures !== 'undefined'){
    this.loaded=false;
    this.textured=true;
    this.textures=obj.textures;
    this.textures.forEach(function(val){
      loadTexture(val, this);
    }, this);
  } else this.textured=false;
};

WObject.prototype.draw = function(){
  setAllShaderVars(this);
  if(this.textured){
    var tex=textures[this.textures[0]];
    gl.activeTexture(tex.unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
  }
  gl.drawArrays(this.drawType, 0, this.shaderVars.a_Position.data.length/2);
};

WObject.prototype.checkObjLoaded = function(){
  if(!this.textured) return;
  else{
    this.loaded=true;
    this.textures.forEach(function(val){
      if(textures[val] && textures[val].loaded) return;
      this.loaded=false;
    }, this);
  }
};

WObject.prototype.releaseTextureUnits = function(){
  this.textures.forEach(function(val){
    texUnits[textures[val].unit-gl.TEXTURE0]=false;
  });
};

WObject.prototype.gatherTextureUnits = function(){
  this.textures.forEach(function(val){
    activateTexUnit(this.program, val);
  }, this);
};
