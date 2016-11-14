//Ship data stored here.
var Ship = function(){
  var obj = JSON.parse(loadExternalFile(objDir+"ship.json"));
  this.textured= obj.textured;
  this.loaded= obj.loaded;
  this.blend= obj.blend;
  this.vshader= obj.vshader;
  this.fshader= obj.fshader;
  this.shaderVars=new ShaderVars(obj.vars);
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars); 
  this.texture=obj.texture;
  this.surfaceTexture=obj.surfaceTexture;
  this.surfaceTextures=[obj.surfaceTextures];
  loadTexture(this.texture, this);
//  loadCubeMap(this.surfaceTexture, this.surfaceTextures, this);
};

/**
 * Checks to see if object textures have loaded.
 */
Ship.prototype.checkObjLoaded= function(){
  this.loaded =
    textures[this.texture]        &&
    textures[this.texture].loaded // && 
//    textures[this.surfaceTexture] && 
//    textures[this.surfaceTexture].loaded;
};

Ship.prototype.releaseTextureUnits = function(){
  texUnits[textures[this.texture].unit-gl.TEXTURE0]=false;
//  activateTexUnit(textures[this.surfaceTexture]);
};

Ship.prototype.gatherTextureUnits = function(){
//  texUnits[textures[this.surfaceTexture].unit-gl.TEXTURE0]=false;
  activateTexUnit(this.program, this.texture);
};

/**
 * Draw object.
 */
Ship.prototype.draw= function(){
  if(player.fuel <= 0) return;
  var tex=textures[this.texture];
  gl.activeTexture(tex.unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  setAllShaderVars(this);
  setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
