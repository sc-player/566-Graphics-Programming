var Ground = function(p){
  WObject.call(this, "ground");
  this.drawType=gl.TRIANGLE_STRIP;
  this.planets=p;
};

Ground.prototype = Object.create(WObject.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.getCurrentTexture = function(){
  return this.textures[player.getPTypeIndex()];
};

Ground.prototype.gatherTextureUnits = function(){
  activateTexUnit(this.program, this.getCurrentTexture());
};

var SurfaceShip = function(){
  Object3d.call(this, "surfaceship");
};

SurfaceShip.prototype = Object.create(Object3d.prototype);
SurfaceShip.prototype.constructor = SurfaceShip;

var FuelDepot = function(){
  Object3d.call(this, "fueldepot");
}

FuelDepot.prototype = Object.create(Object3d.prototype);
FuelDepot.prototype.constructor = FuelDepot;

var Armory = function(){
  Object3d.call(this, "armory");
};

Armory.prototype = Object.create(Object3d.prototype);
Armory.prototype.constructor = Armory;

var TradingPost = function(){
  Object3d.call(this, "post");
};

TradingPost.prototype = Object.create(Object3d.prototype);
TradingPost.prototype.constructor = TradingPost;

var QuestHut = function(){
  Object3d.call(this, "questhut");
};

QuestHut.prototype = Object.create(Object3d.prototype);
QuestHut.prototype.constructor = QuestHut;
