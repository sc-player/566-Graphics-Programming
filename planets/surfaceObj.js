var Cube = function(){
  this.points=new Float32Array([
    1,  1,  1,
   -1,  1,  1,
   -1, -1,  1, 
    1, -1,  1, 
    1, -1, -1,
    1,  1, -1,
   -1,  1, -1,
   -1, -1, -1,
  ]);
  this.indices=new Uint8Array([
    0, 1, 2,   0, 2, 3,
    0, 3, 4,   0, 4, 5,
    0, 5, 6,   0, 6, 1,
    1, 6, 7,   1, 7, 2,
    7, 4, 3,   7, 3, 2,
    4, 7, 6,   4, 6, 5  
  ]);
  this.vertexBuffer=createArrBuffer(this.points, gl.STATIC_DRAW);
  this.eleBuffer=createEleBuffer(this.indices, gl.STATIC_DRAW);
};

var cube=new Cube();

var Ground = function(p){
  this.loaded=true;
  this.textured=true;
  this.vshader="vground.glsl";
  this.fshader="fground.glsl";
  this.points=new Float32Array([
    -surfaceSize/2, -1, -surfaceSize/2, surfaceSize/2, 
    -1, -surfaceSize/2, -surfaceSize/2, -1, 
    surfaceSize/2, surfaceSize/2, -1, surfaceSize/2
  ]);
  this.texCoords=new Float32Array([
    -surfaceSize/2, -surfaceSize/2, surfaceSize/2, -surfaceSize/2, 
    -surfaceSize/2, surfaceSize/2, surfaceSize/2, surfaceSize/2
  ]);
  this.program=createShaderProgram(this.vshader, this.fshader);
  gl.bindAttribLocation(this.program, 0, 'a_Position');
  this.program.a_Position = getShaderVar(this.program, 'a_Position');
  this.program.a_TexCoord = getShaderVar(this.program, 'a_TexCoord');
  this.program.u_Image = getShaderVar(this.program, 'u_Image');
  this.program.u_View = getShaderVar(this.program, 'u_View');
  this.program.u_Proj = getShaderVar(this.program, 'u_Proj');
  this.vertexBuffer=createArrBuffer(this.points, gl.STATIC_DRAW);
  this.texBuffer=createArrBuffer(this.texCoords, gl.STATIC_DRAW);
  this.planets=p;
};

Ground.prototype.releaseTextureUnits = function(){
  texUnits[textures[planetTypes[this.planets.types[player.planet]]+"-ground.gif"].unit-gl.TEXTURE0]=false;
};

Ground.prototype.gatherTextureUnits = function(){
  activateTexUnit(textures[planetTypes[this.planets.types[player.planet]]+"-ground.gif"]);
};

Ground.prototype.draw=function(){
  var tex=textures[planetTypes[this.planets.types[player.planet]] + "-ground.gif"];
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, this.vertexBuffer, 3, gl.FLOAT, 0, 0);
  initAttribute(this.program.a_TexCoord, this.texBuffer, 2, gl.FLOAT, 0, 0);
  gl.activeTexture(tex.unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

var SurfaceShip = function(){
  this.loaded=true;
  this.color=[0,1,0,1];
  this.model= (new Matrix4()).setScale(1, 1.2, 1).translate(15, .1, 0);
};

SurfaceShip.prototype.draw = function(){
  gl.uniformMatrix4fv(this.program.u_Model, false, this.model.elements);
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, cube.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_BYTE, 0); 
};

var FuelDepot = function(){
  this.loaded=true;
  this.color=[1,1,1,1]; 
  this.vshader="vfuel.glsl";
  this.fshader="ffuel.glsl";
  this.program=createShaderProgram(this.vshader, this.fshader);
  gl.bindAttribLocation(this.program, 0, 'a_Position');
  this.model= (new Matrix4()).setTranslate(0, 0, -15);
  this.program.a_Position = getShaderVar(this.program, 'a_Position');
  this.program.u_Color = getShaderVar(this.program, 'u_Color');
  this.program.u_Model = getShaderVar(this.program, 'u_Model');
  this.program.u_View = getShaderVar(this.program, 'u_View');
  this.program.u_Proj = getShaderVar(this.program, 'u_Proj');
}

FuelDepot.prototype.draw=function(){
  gl.uniformMatrix4fv(this.program.u_Model, false, this.model.elements);
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, cube.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_BYTE, 0); 
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
  initAttribute(this.program.a_Position, cube.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_BYTE, 0); 
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
  initAttribute(this.program.a_Position, cube.vertexBuffer, 3, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_BYTE, 0); 
};
