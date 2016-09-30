//Grid data stored here.
var grid={
  size: 1,
  color: [1,1,1,1],

/**
 * Generates vertices for the grid.
 *
 * @return {Float32Array} Vertices to draw the grid.
 */
  points: function(){
    var res=[];
    for(i=-galaxySize/2-tileSize/2; i<=galaxySize/2+tileSize; i+=tileSize){
      res.push([i, -galaxySize/2-tileSize/2, i, galaxySize/2+tileSize/2, galaxySize/2+tileSize/2, i, -galaxySize/2-tileSize/2, i])
    }
    return new Float32Array([].concat.apply([], res));
  }(),
  draw: function(){
    gl.useProgram(this.program);
    setUniform(grid.program.u_Translation, cameraTranslation, true);
    setUniform(grid.program.u_Color, grid.color, true);
    initAttribute(grid.program.a_Position, grid.vertexBuffer, 2, gl.FLOAT);
    gl.drawArrays(gl.LINES, 0, grid.points.length/2);
  }
};

//Ship data stored here.
var ship = {
  thruster: new Float32Array([shipLength/2+thrustLength, -shipWidth/5, shipLength/2, -shipWidth/8, shipLength/2+thrustLength, -shipWidth/3+thrustLongWidth/2, shipLength/2, -shipWidth/5+thrustShortWidth, shipLength/2+thrustLength, -shipWidth/3+thrustLongWidth]),
  wind: function(){
    var res = [shipLength/3.5, shipWidth/3];
    for(i=0; i<68; ++i){
      res.push(res[0]+Math.cos(i)*windowRadius);
      res.push(res[1]+Math.sin(i)*windowRadius);
    }
    return new Float32Array(res);
  }(),
  points: new Float32Array([-shipLength/2, 0, shipLength/2, -shipWidth/4, shipLength/2, shipWidth/2]),
  flame: function(){
    var res = [];
    for(i=0; i<numFlames; ++i){
      var startx = shipLength*3/4+thrustLength+flameOffset*i;
      var starty = shipWidth/8;
      for(j=0; j<flameDegrees; ++j){
        res.push(startx+flameRx*Math.cos(j*180/Math.PI));
        res.push(starty+(flameRy+flameDecay*i)*Math.sin(j*180/Math.PI));
      }
    }
    return new Float32Array(res);
  }(),
  flameColor: flameColor,
  thrustColor: thrustColor,
  windowColor: windowColor,
  color: shipColor,
  modelMatrix: new Matrix4(),
  draw: function(){
    gl.useProgram(ship.program);
    initAttribute(ship.program.a_Position, ship.windowBuffer, 2, gl.FLOAT);
    setUniform(ship.program.u_Color, ship.windowColor, true);
    gl.uniformMatrix4fv(ship.program.u_Model, false, ship.modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 69);
    initAttribute(ship.program.a_Position, ship.vertexBuffer, 2, gl.FLOAT);
    setUniform(ship.program.u_Color, ship.color, true);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    initAttribute(ship.program.a_Position, ship.thrustBuffer, 2, gl.FLOAT);
    setUniform(ship.program.u_Color, ship.thrustColor, true);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
    initAttribute(ship.program.a_Position, ship.flameBuffer, 2, gl.FLOAT);
    setUniform(ship.program.u_Color, ship.flameColor, true);
    for(i=0; i<numFlames; ++i){
      gl.drawArrays(gl.LINE_LOOP, flameDegrees*i, flameDegrees);
    }
    gl.disableVertexAttribArray(ship.program.a_Position);
  }
};

//Individual star data is stored here. It is randomly generated.
var stars = {
  points: function(){
    var res=[];
    for(i=0; i<starCount*2; i++){
      res.push(Math.random()*galaxySize-galaxySize/2);
    }
    return new Float32Array(res);
  }(),
  colors: function(){
    var res = [];
    for(i=0; i<starCount; i++){
      res.push(Math.random()/starRedDivisor+starRedOffset);
      res.push(Math.random()/starGreenDivisor+starGreenOffset);
      res.push(Math.random()/starBlueDivisor+starBlueOffset);
    }
    return new Float32Array(res);
  }(),
  sizes: function(){
    var res = [];
    for(i=0; i<starCount; i++){
      res.push(Math.random()*starSize+starSizeOffset);
    }
    return new Float32Array(res);
  }(),
  draw: function(){
    gl.useProgram(stars.program);
    setUniform(stars.program.u_Translation, cameraTranslation, true);
    initAttribute(stars.program.a_Position, stars.vertexBuffer, 2, gl.FLOAT);
    initAttribute(stars.program.a_Color, stars.colorBuffer, 3, gl.FLOAT);
    initAttribute(stars.program.a_Size, stars.sizeBuffer, 1, gl.FLOAT);
    gl.drawArrays(gl.POINTS, 0, starCount);
  }
};

//Shooting star effect data is stored here.
shooter={
  points:new Float32Array([0,1,0,1.2]),
  color:[1,1,1,1],
  modelMatrix: new Matrix4(),
  speed:0,
  angle:0,
  size:0,
  draw: function(){
    gl.useProgram(shooter.program);
    initAttribute(shooter.program.a_Position, shooter.vertexBuffer, 2, gl.FLOAT);
    setUniform(shooter.program.u_Color, shooter.color, true);
    gl.uniformMatrix4fv(shooter.program.u_Model, false, shooter.modelMatrix.elements);
    gl.drawArrays(gl.LINES, 0, 2);
  }
};


