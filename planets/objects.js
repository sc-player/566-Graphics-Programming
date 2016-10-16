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
    initAttribute(grid.program.a_Position, grid.vertexBuffer, 2, gl.FLOAT, 0, 0);
    gl.drawArrays(gl.LINES, 0, grid.points.length/2);
  }
};

//Ship data stored here.
var ship = {
  vshader: "vship.glsl",
  fshader: "fship.glsl",
  blend: true,
  texCoords: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
  points: new Float32Array([-shipWidth, -shipHeight, shipWidth, -shipHeight, -shipWidth, shipHeight, shipWidth, shipWidth]),
  texture: loadTexture("ship.gif"),
  modelMatrix: new Matrix4(),
  init: function(){
    //Get attribute locations
    ship.program.a_Position = getShaderVar(ship.program, 'a_Position');
    ship.program.a_TexCoord = getShaderVar(ship.program, 'a_TexCoord');   

    //Get uniform locations.
    ship.program.u_Model = getShaderVar(ship.program, 'u_Model');
    ship.program.u_Image=getShaderVar(ship.program, 'u_Image');

    ship.vertexBuffer=createArrBuffer(ship.points, gl.STATIC_DRAW);
    ship.textureBuffer=createArrBuffer(ship.texCoords, gl.STATIC_DRAW);
    ship.texUnit=getNewTexUnit();
  },
  draw: function(){
    if(player.fuel <= 0 || !checkTexLoaded(ship.texture)) return;
    setTexture(ship, ship.texture);
    gl.uniformMatrix4fv(ship.program.u_Model, false, ship.modelMatrix.elements);
    initAttribute(ship.program.a_Position, ship.vertexBuffer, 2, gl.FLOAT, 0, 0);
    initAttribute(ship.program.a_TexCoord, ship.textureBuffer, 2, gl.FLOAT, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
    initAttribute(stars.program.a_Position, stars.vertexBuffer, 2, gl.FLOAT, 0, 0);
    initAttribute(stars.program.a_Color, stars.colorBuffer, 3, gl.FLOAT, 0, 0);
    initAttribute(stars.program.a_Size, stars.sizeBuffer, 1, gl.FLOAT, 0, 0);
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
    initAttribute(shooter.program.a_Position, shooter.vertexBuffer, 2, gl.FLOAT, 0, 0);
    setUniform(shooter.program.u_Color, shooter.color, true);
    gl.uniformMatrix4fv(shooter.program.u_Model, false, shooter.modelMatrix.elements);
    gl.drawArrays(gl.LINES, 0, 2);
  }
};

planets={
  vshader: "vplanet.glsl",
  fshader: "fplanet.glsl",
  blend: true,
  textures: function(){
    var res=[];
    for(i=0; i<planetTypes.length; ++i){
      res.push(loadTexture(planetTypes[i] + ".gif"));
    }
    return res;
  }(),
  types: function(){
    var res=[];
    for(i=0; i<planetCount; i++){
      res.push(Math.floor(Math.random()*planetTypes.length));
    }
    return res;
  }(),
//  hostile: (Math.random()>.5),
  fuel: function(){
    var res=[];
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
      var centery = roll-roll%tileSize;
      res.push(centery);
      res.push(0.5);
      res.push(0.5);
      var angle = 360/circleDegrees;
      for(j=0; j<circleDegrees+1; ++j){ 
        var cos=Math.cos(angle*j*Math.PI/180);
        var sin=Math.sin(angle*j*Math.PI/180);
        res.push(centerx+planetSize*cos);
        res.push(centery+planetSize*sin);
        res.push(cos/2+.5);
        res.push(sin/2+.5);
      }
    }
    return new Float32Array(res);
  }(),
  init: function(){
    planets.program.a_Position=getShaderVar(planets.program, 'a_Position');
    planets.program.a_TexCoord=getShaderVar(planets.program, 'a_TexCoord');
    planets.program.u_Translation=getShaderVar(planets.program, 'u_Translation');
    planets.program.u_Image=getShaderVar(planets.program, 'u_Image');
    planets.vertexBuffer=createArrBuffer(planets.points, gl.STATIC_DRAW);
  },
  draw: function(){
    setUniform(planets.program.u_Translation, cameraTranslation, true);
    initAttribute(planets.program.a_Position, planets.vertexBuffer, 2, gl.FLOAT, 16, 0);
    initAttribute(planets.program.a_TexCoord, planets.vertexBuffer, 2, gl.FLOAT, 16, 8);
    for(i=0; i<planetCount; ++i){
      if(!checkTexLoaded(planets.textures[planets.types[i]])) continue;
      setTexture(planets, planets.textures[planets.types[i]]);
      gl.drawArrays(gl.TRIANGLE_FAN, i*(circleDegrees+2), circleDegrees+2);
    }
  }
}
