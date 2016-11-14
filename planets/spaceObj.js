//Grid data stored here.
var Grid = function(){
  var obj = JSON.parse(loadExternalFile(objDir+"grid.json"));
  this.loaded= obj.loaded;
  this.vshader= obj.vshader;
  this.fshader= obj.fshader;
  this.shaderVars=new ShaderVars(obj.vars);
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars); 
};

/**
 * Draw object.
 */
Grid.prototype.draw= function(){
  setAllShaderVars(this);
  gl.drawArrays(gl.LINES, 0, this.shaderVars.a_Position.data.length/2);
};

//Individual star data is stored here. It is randomly generated.
var Stars = function(){ 
  var obj = JSON.parse(loadExternalFile(objDir+"stars.json"));
  this.loaded= obj.loaded;
  this.vshader= obj.vshader;
  this.fshader= obj.fshader;
  this.shaderVars=new ShaderVars(obj.vars);
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);  
};

/**
 * Draw object.
 */
Stars.prototype.draw=function(){
  setAllShaderVars(this);
  gl.drawArrays(gl.POINTS, 0, starCount);
};


//Shooting star effect data is stored here.
var Shooter=function(){
  var obj = JSON.parse(loadExternalFile(objDir+"shooter.json"));
  this.loaded=obj.loaded;
  this.vshader=obj.vshader;
  this.fshader=obj.fshader;
  this.shaderVars = new ShaderVars(obj.vars);
  this.speed=0;
  this.angle=0;
  this.size=0;  
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);
}
/**
 * Draw object.
 */
Shooter.prototype.draw= function(){
  setAllShaderVars(this);
  gl.drawArrays(gl.LINES, 0, 2);
};

Shooter.prototype.animate= function(){
  var model=this.shaderVars.u_Model.data;
  var shootRoll=Math.random()*1000;
  if(shootRoll>shootChance && this.speed<=0){
    this.speed=Math.random()/15+.09;
    this.size=Math.random()*3;
    var length=Math.random()*2+1;
    this.angle=Math.random()*30-15;
    model.setTranslate(0, -1, 0);
    model.rotate(this.angle, 0, 0, 1);
    model.scale(1, length, 1);
    model.translate(Math.random()*2-1, 1, 0);
  } else if(this.speed>0){
    if(model.elements[13]+model.elements[5]<=-1){
      this.speed=0;
      this.size=0;
      this.angle=0;
      model.setIdentity();
    } else
      model.translate(this.speed*Math.sin(this.angle*(Math.PI/180)), 
        -this.speed*Math.cos(this.angle*(Math.PI/180)), 0); 
  }
};
