//Planets data stored here.
var Planets=function(){
  WObject.call(this, "planets");
  this.types=function(){
    var res=[];
    for(i=0; i<planetCount; i++){
      res.push(Math.floor(Math.random()*planetTypes.length));
    }
    return res;
  }();

  this.fuel=function(){
    var res=[];
    for(i=0; i<planetCount; ++i){
      res.push(Math.round(Math.random()*5+10));
    }
    return res;
  }(); 
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
  player.planets=this;
  for(i=0; i<this.shaderVars.a_Position.data.length; i+=(circleDegrees+2)*2){
    player.centers.push(this.shaderVars.a_Position.data[i]);
    player.centers.push(this.shaderVars.a_Position.data[i+1]); 
  }
};

Planets.prototype = Object.create(WObject.prototype);
Planets.prototype.constructor = Planets;

/**
 * Draw object.
 */
Planets.prototype.draw=function(){
  this.shaderVars.setAllShaderVars(this);
  for(i=0; i<planetCount; ++i){
    var tex=textures[planetTypes[this.types[i]]+".gif"];
    gl.activeTexture(tex.unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
    gl.drawArrays(gl.TRIANGLE_FAN, i*(circleDegrees+2), circleDegrees+2);
  }
};

