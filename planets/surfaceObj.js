var Object3d = function(name){
  WObject.call(this, name);
  this.drawType=gl.TRIANGLES;
  if(typeof this.json.coords !== 'undefined') 
    this.shaderVars.u_Model.data.translate(this.json.coords[0], 
      this.json.coords[1], this.json.coords[2]);
  if(typeof this.json.rot !== 'undefined') 
    this.shaderVars.u_Model.data.rotate(this.json.rot[0], 
      this.json.rot[1], this.json.rot[2], this.json.rot[3]);
  if(typeof this.json.scale !== 'undefined') 
    this.shaderVars.u_Model.data.scale(this.json.scale[0], this.json.scale[1],
      this.json.scale[2]);
};

Object3d.prototype = Object.create(WObject.prototype);
Object3d.prototype.constructor = Object3d;

Object3d.prototype.points=new Float32Array([
  //Corners
  1,  1,  1,    -1,  1,  1,
 -1, -1,  1,     1, -1,  1,
  1, -1, -1,     1,  1, -1,
 -1,  1, -1,    -1, -1, -1,
  //Face centers
  0,  0,  1,     1,  0,  0,
  0,  1,  0,     0, -1,  0,
 -1,  0,  0,     0,  0, -1,
  //Middle
  0,  0,  0
]);

Object3d.prototype.cube=new Uint8Array([
  0, 1, 2,   0, 2, 3,
  0, 3, 4,   0, 4, 5,
  0, 5, 6,   0, 6, 1,
  1, 6, 7,   1, 7, 2,
  7, 4, 3,   7, 3, 2,
  4, 7, 6,   4, 6, 5
]);

Object3d.prototype.pyramid=new Uint8Array([
  7, 4, 3,   7, 3, 2,
  7, 3, 10,  7, 2, 10,
  3, 4, 10,  3, 2, 10
]);

Object3d.prototype.vertexBuffer=
  createBuff(gl.ARRAY_BUFFER, Object3d.prototype.points);
Object3d.prototype.cubeBuffer=
  createBuff(gl.ELEMENT_ARRAY_BUFFER, Object3d.prototype.cube);
Object3d.prototype.pyramidBuffer=
  createBuff(gl.ELEMENT_ARRAY_BUFFER, Object3d.prototype.pyramid);

Object3d.prototype.draw = function(){
  this.shaderVars.setAllShaderVars(this);
  if(this.textured){
    var tex = textures[this.getCurrentTexture()];
    gl.activeTexture(tex.unit);
    gl.bindTexture((typeof this.cubeTexture !== 'undefined') ? gl.TEXTURE_CUBE_MAP : 
      gl.TEXTURE_2D, tex);
  }
  gl.drawElements(this.drawType, Object3d.prototype[this.objs[0]].length, 
    gl.UNSIGNED_BYTE, 0); 
}

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
  activateTexUnit(this.program, this.textures[player.getPTypeIndex()]);
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
