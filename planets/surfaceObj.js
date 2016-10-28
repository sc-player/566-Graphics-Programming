var Ground = function(){
  this.loaded=true;
  this.vshader="vground.glsl";
  this.fshader="fground.glsl";
  this.points=new Float32Array([-100, -1, -100, 100, -1, -100, -100, -1, 100, 100, -1, 100]);
  this.color=[1, 1, 1, 1];
};

Ground.prototype.init=function(){
  this.program.a_Position = getShaderVar(this.program, 'a_Position');
  this.program.u_Color = getShaderVar(this.program, 'u_Color');
  this.program.u_View = getShaderVar(this.program, 'u_View');
  this.program.u_Proj = getShaderVar(this.program, 'u_Proj');
  this.vertexBuffer=createArrBuffer(this.points, gl.STATIC_DRAW);
};

Ground.prototype.draw=function(){
  gl.uniformMatrix4fv(this.program.u_View, false, player.view.elements);
  gl.uniformMatrix4fv(this.program.u_Proj, false, player.perspective.elements);
  setUniform(this.program.u_Color, this.color, true);
  initAttribute(this.program.a_Position, this.vertexBuffer, 3, gl.FLOAT, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

var Cube = function(){
  this.loaded=true;
}
