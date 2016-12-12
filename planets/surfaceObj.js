var mStack = [];
function pushMat4(m){
  var m2 = new Matrix4(m);
  mStack.push(m2); 
}
function popMat4(){
  return mStack.pop();
}

var Object3d = function(name){
  WObject.call(this, name);
  this.drawType=gl.TRIANGLES;
  if(typeof this.json.coords !== 'undefined') this.pos=this.json.coords;
  if(typeof this.json.rot !== 'undefined') this.rot=this.json.rot;
  if(typeof this.json.scale !== 'undefined') this.scale=this.json.scale;
};

Object3d.prototype = Object.create(WObject.prototype);
Object3d.prototype.constructor = Object3d;

Object3d.prototype.cubePoints=new Float32Array([
  //Corners
  //front
  1,  1,  1,    -1,  1,  1,    -1, -1,  1,     1, -1,  1,     
  //right
  1,  1,  1,     1, -1,  1,     1, -1, -1,     1,  1, -1,
  //up
  1,  1,  1,     1,  1, -1,    -1,  1, -1,    -1,  1,  1,  
  //left
 -1,  1,  1,    -1,  1, -1,    -1, -1, -1,    -1, -1,  1,
  //down
 -1, -1, -1,     1, -1, -1,     1, -1,  1,    -1, -1,  1,
  //back
  1, -1, -1,     1,  1, -1,    -1,  1, -1,    -1, -1, -1,
]);

Object3d.prototype.cube=new Uint8Array([
  0, 1, 2,   0, 2, 3,    //front
  4, 5, 6,   4, 6, 7,    //right
  8, 9,10,  8, 10,11,    //up
 12,13,14,  12,14,15,    //left
 16,17,18,  16,18,19,    //down
 20,21,22,  20,22,23     //back
]);

Object3d.prototype.pyramidPoints=new Float32Array([
  //front 
  0,  1,  0,    -1, -1,  1,     1, -1,  1,
  //right 
  0,  1,  0,     1, -1,  1,     1, -1, -1,
  //left
  0,  1,  0,    -1, -1,  -1,    1, -1, -1,
  //back
  0,  1,  0,     1, -1,  -1,   -1, -1, -1,
  //down
 -1, -1, -1,     1, -1, -1,     1, -1,  1,    -1, -1,  1,
]);

Object3d.prototype.pyramid=new Uint8Array([
  0, 1, 2,  3, 4, 5,     //front, right
  6, 7, 8,  9,10,11,     //left, back
 12,13,14, 12,14,15      //down
]);

Object3d.prototype.cubeBuffer={
  vertices: createBuff(gl.ARRAY_BUFFER, Object3d.prototype.cubePoints),
  indices: createBuff(gl.ELEMENT_ARRAY_BUFFER, Object3d.prototype.cube)
};

Object3d.prototype.pyramidBuffer={
  vertices: createBuff(gl.ARRAY_BUFFER, Object3d.prototype.pyramidPoints),
  indices: createBuff(gl.ELEMENT_ARRAY_BUFFER, Object3d.prototype.pyramid)
};

Object3d.prototype.createModelMatrix = function(){
  this.shaderVars.u_Model.data = new Matrix4();
  if(typeof this.pos !== 'undefined') 
    this.shaderVars.u_Model.data.translate(
      this.pos[0], this.pos[1], this.pos[2]
    );
  if(typeof this.rot !== 'undefined') 
    this.shaderVars.u_Model.data.rotate(
      this.json.rot[0], this.rot[1], this.rot[2], this.rot[3]
    );
  if(typeof this.scale !== 'undefined') 
    this.shaderVars.u_Model.data.scale(
      this.scale[0], this.scale[1], this.scale[2]
    );
  ;
  this.shaderVars.u_NormalMatrix.data = new Matrix4(this.shaderVars.u_Model.data).setInverseOf(
    new Matrix4(player.view).concat(this.shaderVars.u_Model.data)
  ).transpose();
};

Object3d.prototype.draw = function(){
  this.createModelMatrix();
  WObject.prototype.draw.call(this);
};

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
