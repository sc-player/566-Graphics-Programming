var Ground = function(p){
  this.loaded=true;
  this.vshader="vground.glsl";
  this.fshader="fground.glsl";
  this.points=new Float32Array([-100, -1, -100, 100, -1, -100, -100, -1, 100, 100, -1, 100]);
  this.texCoords=new Float32Array([0, 0, .5, 0, 0, .5, .5, .5]);
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

Ground.prototype.draw=function(){
  var tex=this.planets.textures[7];
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  initAttribute(this.program.a_Position, this.vertexBuffer, 3, gl.FLOAT, 0, 0);
  initAttribute(this.program.a_TexCoord, this.texBuffer, 2, gl.FLOAT, 0, 0);
  gl.activeTexture(tex.unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

var Cube = function(){
  this.loaded=true;
}
