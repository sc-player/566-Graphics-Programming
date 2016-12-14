//Grid data stored here.
var Grid = function(){
  WObject.call(this, "grid"); 
  this.drawType=gl.LINES;
};

Grid.prototype = Object.create(WObject.prototype);
Grid.prototype.constructor = Grid;

//Individual star data is stored here. It is randomly generated.
var Stars = function(){ 
  WObject.call(this, "stars");
  this.drawType=gl.POINTS;
};

Stars.prototype = Object.create(WObject.prototype);
Stars.prototype.constructor = Stars;

//Shooting star effect data is stored here.
var Shooter=function(){
  WObject.call(this, "shooter");
  this.speed=0;
  this.angle=0;
  this.size=0;  
  this.drawType=gl.LINES;
}

Shooter.prototype = Object.create(WObject.prototype);
Shooter.prototype.constructor = Shooter;

Shooter.prototype.animate= function(){
  var model=this.shaderVars.u_Model.data;
  var shootRoll=Math.random()*1000;
  if(shootRoll>shootChance && this.speed<=0){
    this.speed=Math.random()/250+.003;
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
    } else model.translate(
        deltaTime*this.speed*Math.sin(this.angle*(Math.PI/180)), 
       -deltaTime*this.speed*Math.cos(this.angle*(Math.PI/180)), 
        0
      ); 
  }
};
