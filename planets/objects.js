//Grid data stored here.
var grid={
  vshader: "vgrid.glsl",
  fshader: "fgrid.glsl",
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
  init: function(){
    //Get attribute locations
    grid.program.a_Position = getShaderVar(grid.program, 'a_Position');

    //Get uniform locations.
    grid.program.u_Color = getShaderVar(grid.program, 'u_Color');
    grid.program.u_Translation = getShaderVar(grid.program, 'u_Translation');

    grid.vertexBuffer=createArrBuffer(grid.points, gl.STATIC_DRAW);
  },
  draw: function(){
    setUniform(grid.program.u_Translation, cameraTranslation, true);
    setUniform(grid.program.u_Color, grid.color, true);
    initAttribute(grid.program.a_Position, grid.vertexBuffer, 2, gl.FLOAT);
    gl.drawArrays(gl.LINES, 0, grid.points.length/2);
  }
};

//Ship data stored here.
var ship = {
  vshader: "vship.glsl",
  fshader: "fship.glsl",
  texCoords: [0, 0, 1, 0, 1, 1, 0, 1],
  points: new Float32Array([-shipLength/2, 0, shipLength/2, -shipWidth/4, shipLength/2, shipWidth/2]),
  //shipTexture: loadTexture("ship.gif"),
  modelMatrix: new Matrix4(),
  init: function(){
    //Get attribute locations
    ship.program.a_Position = getShaderVar(ship.program, 'a_Position');

    //Get uniform locations.
    ship.program.u_Color = getShaderVar(ship.program, 'u_Color');
    ship.program.u_Model = getShaderVar(ship.program, 'u_Model');

    ship.vertexBuffer=createArrBuffer(ship.points, gl.STATIC_DRAW);
  },
  draw: function(){
    if(player.fuel<=0) return;
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
  vshader: "vstar.glsl",
  fshader: "fstar.glsl",
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
  init: function(){
    stars.program.a_Position = getShaderVar(stars.program, 'a_Position');
    stars.program.a_Size = getShaderVar(stars.program, 'a_Size');
    stars.program.a_Color = getShaderVar(stars.program, 'a_Color');
    stars.program.u_Translation = getShaderVar(stars.program, 'u_Translation');

    stars.vertexBuffer=createArrBuffer(stars.points, gl.STATIC_DRAW);
    stars.colorBuffer=createArrBuffer(stars.colors, gl.STATIC_DRAW);
    stars.sizeBuffer=createArrBuffer(stars.sizes, gl.STATIC_DRAW);
  },
  draw: function(){
    setUniform(stars.program.u_Translation, cameraTranslation, true);
    initAttribute(stars.program.a_Position, stars.vertexBuffer, 2, gl.FLOAT);
    initAttribute(stars.program.a_Color, stars.colorBuffer, 3, gl.FLOAT);
    initAttribute(stars.program.a_Size, stars.sizeBuffer, 1, gl.FLOAT);
    gl.drawArrays(gl.POINTS, 0, starCount);
  }
};

//Shooting star effect data is stored here.
shooter={
  vshader: "vshoot.glsl",
  fshader: "fshoot.glsl",
  points:new Float32Array([0,1,0,1.2]),
  color:[1,1,1,1],
  modelMatrix: new Matrix4(),
  speed:0,
  angle:0,
  size:0,
  init: function(){
    shooter.program.a_Position = getShaderVar(shooter.program, 'a_Position');
    shooter.program.u_Color = getShaderVar(shooter.program, 'u_Color');
    shooter.program.u_Model = getShaderVar(shooter.program, 'u_Model');
    shooter.vertexBuffer=createArrBuffer(shooter.points, gl.DYNAMIC_DRAW);
  },
  draw: function(){
    initAttribute(shooter.program.a_Position, shooter.vertexBuffer, 2, gl.FLOAT);
    setUniform(shooter.program.u_Color, shooter.color, true);
    gl.uniformMatrix4fv(shooter.program.u_Model, false, shooter.modelMatrix.elements);
    gl.drawArrays(gl.LINES, 0, 2);
  }
};

planets={
  vshader: "vplanet.glsl",
  fshader: "fplanet.glsl",
//  hostile: (Math.random()>.5),
  fuel: function(){
    res=[];
    for(i=0; i<planetCount; ++i){
      res.push(Math.round(Math.random()*5+10));
    }
    return res;
  }(),
  points: function(){
    var res=[];
    for(i=0; i<planetCount; i++){
      var roll = Math.random()*galaxySize-galaxySize/2;
      var centerx = roll-roll%tileSize;
      res.push(centerx);
      roll = Math.random()*galaxySize-galaxySize/2;
      var centery=roll-roll%tileSize;
      res.push(centery);
      for(j=0; j<planetDegrees; ++j){
        res.push(centerx+planetSize*Math.cos(j*180/Math.PI));
        res.push(centery+planetSize*Math.sin(j*180/Math.PI));
      }
    }
    return new Float32Array(res);
  }(),
  color: [66/255, 44/255, 26/255, 1],
  init: function(){
    planets.program.a_Position=getShaderVar(planets.program, 'a_Position');
    planets.program.u_Color=getShaderVar(planets.program, 'u_Color');
    planets.program.u_Translation=getShaderVar(planets.program, 'u_Translation');
    planets.vertexBuffer=createArrBuffer(planets.points, gl.STATIC_DRAW);
  },
  draw: function(){
    setUniform(planets.program.u_Translation, cameraTranslation, true);
    setUniform(planets.program.u_Color, planets.color, true);
    initAttribute(planets.program.a_Position, planets.vertexBuffer, 2, gl.FLOAT);
    for(i=0; i<planetCount; ++i){
      gl.drawArrays(gl.TRIANGLE_FAN, i*planetDegrees+i, planets.points.length/(2*planetCount));
    }
  }
}
