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
  modelMatrix: new Matrix4()
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
};

//Shooting star effect data is stored here.
shooter={
    x:galaxySize,
    y:galaxySize,
    color:[1,1,1,1],
    length:0,

/**
 * Gets current vertices of the shooting star.
 *
 * @return {Array} Array of vertices for the shooting star.
 */
    getPoints: function(){
      if(!this.length) return [1.1, 1.1, 1.1, 1.1];
      return [
        this.x,
        this.y,
        this.x-this.length*Math.sin(this.angle*(Math.PI/180)),
        this.y+this.length*Math.cos(this.angle*(Math.PI/180))
      ];
    },
    modelMatrix: new Matrix4()
};


