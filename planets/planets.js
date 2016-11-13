//Planets data stored here.
var Planets=function(){
  this.textured=true;
  this.loaded=false;
  this.vshader= "vplanet.glsl";
  this.fshader= "fplanet.glsl";
  for(i=0; i<planetTypes.length; ++i){
    loadTexture(planetTypes[i] + ".gif", this);
    loadTexture(planetTypes[i] + "-ground.gif", this);
  }

/**
 * Generate planet types.
 */
  this.types=function(){
    var res=[];
    for(i=0; i<planetCount; i++){
      res.push(Math.floor(Math.random()*planetTypes.length));
    }
    return res;
  }();

/**
 * Generate fuel.
 */
  this.fuel=function(){
    var res=[];
    for(i=0; i<planetCount; ++i){
      res.push(Math.round(Math.random()*5+10));
    }
    return res;
  }();

/**
 * Generate points.
 */
    
  
  this.populated=function(types){
    var res=[];
    for(var i=0; i<planetCount; ++i){
      var planetType=types[i];
      if(typeInfo[planetType].populated)
        res.push(Math.random()<typeInfo[planetType].populationChance);
      else res.push(false);
    }
    return res;
  }(this.types);
  this.shaderVars= new ShaderVars(
    ["a_Position", "a_TexCoord", "u_Translation", "u_Image"],
    function(){
      var res=[];
      var texRes=[];
      for(i=0; i<planetCount; i++){
        var roll = Math.random()*galaxySize-galaxySize/2;
        var centerx = roll-roll%tileSize;
        res.push(centerx);
        roll = Math.random()*galaxySize-galaxySize/2;
        var centery = roll-roll%tileSize;
        res.push(centery);
        texRes.push(.5);
        texRes.push(.5);
        var angle = 360/circleDegrees;
        for(j=0; j<circleDegrees+1; ++j){
          var cos=Math.cos(angle*j*Math.PI/180);
          var sin=Math.sin(angle*j*Math.PI/180);
          res.push(centerx+planetSize*cos);
          res.push(centery+planetSize*sin);
          texRes.push(cos/2+.5);
          texRes.push(sin/2+.5);
        } 
      } 
      return [new Float32Array(res), new Float32Array(texRes)];
    }().concat([cameraTranslation, null]), [2, 2, false, false],
    [[false, false, false, true], [false, false, false, false]] 
  );
  player.planets=this;
  for(i=0; i<this.shaderVars.a_Position.data.length; i+=(circleDegrees+2)*2){
    player.centers.push(this.shaderVars.a_Position.data[i]);
    player.centers.push(this.shaderVars.a_Position.data[i+1]); 
  }
  this.blend=true;
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);
};

/**
 * Checks to see if object textures have loaded.
 */
Planets.prototype.checkObjLoaded=function(){
  for(var i=0; i<planetTypes.length; ++i){
    var tex1 = textures[planetTypes[i]+".gif"];
    var tex2 = textures[planetTypes[i]+"-ground.gif"];
    if(tex1 && tex1.loaded && tex2 && tex2.loaded) continue;
    this.loaded=false;
    return;
  }
  this.loaded=true;
};

Planets.prototype.releaseTextureUnits = function(){
  planetTypes.forEach(function(val){
    texUnits[textures[val+".gif"].unit-gl.TEXTURE0]=false;
  });
};

Planets.prototype.gatherTextureUnits = function(){
  planetTypes.forEach(function(val){
    activateTexUnit(this.program, val+".gif");
  }, this);
}

/**
 * Draw object.
 */
Planets.prototype.draw=function(){
  setAllShaderVars(this);
  for(i=0; i<planetCount; ++i){
    var tex=textures[planetTypes[this.types[i]]+".gif"];
    gl.activeTexture(tex.unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
    gl.drawArrays(gl.TRIANGLE_FAN, i*(circleDegrees+2), circleDegrees+2);
  }
};

