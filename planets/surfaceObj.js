var Object3d = function(name){
  WObject.call(this, name);
  this.drawType=gl.TRIANGLES;
  var obj = JSON.parse(loadExternalFile(name+".json"));
  points= new Float32Array(obj.points);
  cube: new Uint8Array(obj.cube);
  pyramid: new Uint8Array(obj.pyramid);
};

//object3d.vertexBuffer=createBuff(gl.ARRAY_BUFFER, object3d.points);
//object3d.cubeBuffer=createBuff(gl.ELEMENT_ARRAY_BUFFER, object3d.cube);
//object3d.pyramidBuffer=createBuff(gl.ELEMENT_ARRAY_BUFFER, object3d.pyramid);

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

/*var SurfaceShip = function(){
  this.loaded=true;
  this.color=[0,1,0,1];
  this.model= (new Matrix4()).setScale(1, 1.2, 1).translate(15, .1, 0);
};

SurfaceShip.prototype.draw = function(){
  gl.uniformMatrix4fv(this.program.u_Model, false, this.model.elements);
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, object3d.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object3d.cubeBuffer); 
  gl.drawElements(gl.TRIANGLES, object3d.cube.length, gl.UNSIGNED_BYTE, 0); 
};

var FuelDepot = function(){
  this.loaded=true;
  this.color=[1,1,1,1]; 
  this.vshader="vfuel.glsl";
  this.fshader="ffuel.glsl";
  this.shaderVars=[
    a_Position: {
      data: object3d.points, 3, gl.FLOAT, 0, 0
    },
    u_Color: this.color, u_Model: 0,
    u_View: player.view, u_Proj: player.proj
  ];
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);
  this.cubeModel= (new Matrix4()).setTranslate(0, 0, -15);
  this.pyramidModel= (new Matrix4()).setTranslate(0, 2, -15).scale(1.5,1,1.5);
}

FuelDepot.prototype.draw=function(){
  gl.uniformMatrix4fv(this.program.u_Model, false, this.cubeModel.elements);
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, object3d.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object3d.cubeBuffer); 
  gl.drawElements(gl.TRIANGLES, object3d.cube.length, gl.UNSIGNED_BYTE, 0); 
  gl.uniformMatrix4fv(this.program.u_Model, false, this.pyramidModel.elements);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object3d.pyramidBuffer); 
  gl.drawElements(gl.TRIANGLES, object3d.pyramid.length, gl.UNSIGNED_BYTE, 0); 
};

var Armory = function(){
  this.loaded=true;
  this.color=[1,1,0,1];
  this.model= (new Matrix4()).setTranslate(-15, 0, 0).rotate(30, 0, 1, 0).scale(2, 1.2, 2)
};

Armory.prototype.draw = function(){
  gl.uniformMatrix4fv(this.program.u_Model, false, this.model.elements);
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, object3d.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object3d.cubeBuffer); 
  gl.drawElements(gl.TRIANGLES, object3d.cube.length, gl.UNSIGNED_BYTE, 0); 
};

var TradingPost = function(){
  this.loaded=true;
  this.color=[0,1,1,1];
  this.model= (new Matrix4()).setScale(3, 1, 1.5).translate(0, 0, 15);
};

TradingPost.prototype.draw = function(){
  gl.uniformMatrix4fv(this.program.u_Model, false, this.model.elements);
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, object3d.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object3d.cubeBuffer);
  gl.drawElements(gl.TRIANGLES, object3d.cube.length, gl.UNSIGNED_BYTE, 0); 
};*/
