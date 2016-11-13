var object3d = {
  points: new Float32Array([
    1,  1,  1,
   -1,  1,  1,
   -1, -1,  1, 
    1, -1,  1, 
    1, -1, -1,
    1,  1, -1,
   -1,  1, -1,
   -1, -1, -1,
    0,  0,  1,
    1,  0,  0,
    0,  1,  0,
    0, -1,  0,
    -1, 0,  0,
    0,  0, -1,
    0,  0,  0
  ]),
  cube: new Uint8Array([
    0, 1, 2,   0, 2, 3,
    0, 3, 4,   0, 4, 5,
    0, 5, 6,   0, 6, 1,
    1, 6, 7,   1, 7, 2,
    7, 4, 3,   7, 3, 2,
    4, 7, 6,   4, 6, 5  
  ]),
  pyramid: new Uint8Array([
    7, 4, 3,   7, 3, 2,
    7, 3, 10,  7, 2, 10,
    3, 4, 10,  3, 2, 10 
  ]),
};

object3d.vertexBuffer=createBuff(gl.ARRAY_BUFFER, object3d.points);
object3d.cubeBuffer=createBuff(gl.ELEMENT_ARRAY_BUFFER, object3d.cube);
object3d.pyramidBuffer=createBuff(gl.ELEMENT_ARRAY_BUFFER, object3d.pyramid);

var Ground = function(p){
  this.loaded=true;
  this.textured=true;
  this.vshader="vground.glsl";
  this.fshader="fground.glsl";
  this.shaderVars = new ShaderVars(
    ["a_Position", "a_TexCoord", "u_Image", "u_View", "u_Proj"],
    [new Float32Array([
        -surfaceSize/2, -1, -surfaceSize/2, surfaceSize/2, 
        -1, -surfaceSize/2, -surfaceSize/2, -1, 
        surfaceSize/2, surfaceSize/2, -1, surfaceSize/2
      ]), new Float32Array([
        -surfaceSize/2, -surfaceSize/2, surfaceSize/2, -surfaceSize/2, 
        -surfaceSize/2, surfaceSize/2, surfaceSize/2, surfaceSize/2
      ]), null, player.view, player.perspective
    ], [3, 2, false, false, false], [[false, false, true, false, false], 
    [false, false, false, true, true]]
  );
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);
  this.planets=p;
};

Ground.prototype.releaseTextureUnits = function(){
  texUnits[textures[planetTypes[this.planets.types[player.planet]]+"-ground.gif"].unit-gl.TEXTURE0]=false;
};

Ground.prototype.gatherTextureUnits = function(){
  activateTexUnit(this.program,
    planetTypes[this.planets.types[player.planet]]+"-ground.gif");
};

Ground.prototype.draw=function(){
  var tex=textures[planetTypes[this.planets.types[player.planet]] + "-ground.gif"];
  setAllShaderVars(this);
  setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
  gl.activeTexture(tex.unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
