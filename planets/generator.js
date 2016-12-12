var Generator = function(){
  return {
    gridPoints: function(){
      var res=[];
        for(this.i=-galaxySize/2-tileSize/2; this.i<=galaxySize/2+tileSize; this.i+=tileSize){
        res.push([this.i, -galaxySize/2-tileSize/2, this.i, galaxySize/2+tileSize/2, galaxySize/2+tileSize/2, this.i, -galaxySize/2-tileSize/2, this.i])
      }
      return new Float32Array([].concat.apply([], res));
    }(),
    
    starPoints: function(){
      var res=[];
      for(this.i=0; this.i<starCount*2; this.i++){
        res.push(Math.random()*galaxySize-galaxySize/2);
      }
      return new Float32Array(res);
    }(), 

    starColors: function(){
      var res = [];
      for(this.i=0; this.i<starCount; this.i++){
        res.push(Math.random()/starRedDivisor+starRedOffset);
        res.push(Math.random()/starGreenDivisor+starGreenOffset);
        res.push(Math.random()/starBlueDivisor+starBlueOffset);
      }
      return new Float32Array(res);
    }(), 
    
    starSizes: function(){
      var res = [];
      for(this.i=0; this.i<starCount; this.i++){
        res.push(Math.random()*starSize+starSizeOffset);
      }
      return new Float32Array(res);
    }(),
  
    shootPoints: new Float32Array([0,1,0,1.2]),
    
    shipPoints: new Float32Array([
      -shipWidth, -shipHeight, shipWidth, -shipHeight,
      -shipWidth, shipHeight, shipWidth, shipWidth
    ]),

    shipCoords: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),

    planetPoints: function(){
      var res=[];
      for(this.i=0; this.i<planetCount; this.i++){
        var roll = Math.random()*galaxySize-galaxySize/2;
        var centerx = roll-roll%tileSize;
        res.push(centerx);
        roll = Math.random()*galaxySize-galaxySize/2;
        var centery = roll-roll%tileSize;
        res.push(centery);
        var angle = 360/circleDegrees;
        for(this.j=0; this.j<circleDegrees+1; ++this.j){
          var cos=Math.cos(angle*this.j*Math.PI/180);
          var sin=Math.sin(angle*this.j*Math.PI/180);
          res.push(centerx+planetSize*cos);
          res.push(centery+planetSize*sin);
        }
      }
      return new Float32Array(res);
    }(),

    planetCoords: function(){
      var res=[];
      for(this.i=0; this.i<planetCount; this.i++){
        res.push(.5);
        res.push(.5);
        var angle = 360/circleDegrees;
        for(this.j=0; this.j<circleDegrees+1; ++this.j){
          var cos=Math.cos(angle*this.j*Math.PI/180);
          var sin=Math.sin(angle*this.j*Math.PI/180);
          res.push(cos/2+.5);
          res.push(sin/2+.5);
        }
      }
      return new Float32Array(res);
    }(),
    
    groundPoints: new Float32Array([
      -surfaceSize/2, -1, -surfaceSize/2, surfaceSize/2,
      -1, -surfaceSize/2, -surfaceSize/2, -1,
      surfaceSize/2, surfaceSize/2, -1, surfaceSize/2
    ]),
  
    groundCoords: new Float32Array([
      -surfaceSize/20, -surfaceSize/20, surfaceSize/20, -surfaceSize/20,
      -surfaceSize/20, surfaceSize/20, surfaceSize/20, surfaceSize/20
    ]),

    cubeNormals: new Float32Array([
      0, 0, 1,   0, 0, 1,    0, 0, 1,    0, 0, 1,
      1, 0, 0,   1, 0, 0,    1, 0, 0,    1, 0, 0,
      0, 1, 0,   0, 1, 0,    0, 1, 0,    0, 1, 0,
     -1, 0, 0,  -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
      0,-1, 0,   0,-1, 0,    0,-1, 0,    0,-1, 0,
      0, 0,-1,   0, 0,-1,    0, 0,-1,    0, 0,-1
    ]),
   
    ambientColor: [.2, .2, .2],
    lightDir: [-1, 1, -1],
    directionColor: [0.8, 0.8, 0.8],

    view: function(){ return player.view; },
    proj: function(){ return player.perspective; }
  }
}();
