//Grid data stored here.
var Grid = function(){
  this.loaded= true;
  this.vshader= "vgrid.glsl";
  this.fshader= "fgrid.glsl";
  this.size= 1;
  this.color= [1,1,1,1];

/**
 * Generates vertices for the grid.
 *
 * @return {Float32Array} Vertices to draw the grid.
 */
  this.points= function(){
    var res=[];
    for(i=-galaxySize/2-tileSize/2; i<=galaxySize/2+tileSize; i+=tileSize){
      res.push([i, -galaxySize/2-tileSize/2, i, galaxySize/2+tileSize/2, galaxySize/2+tileSize/2, i, -galaxySize/2-tileSize/2, i])
    }
    return new Float32Array([].concat.apply([], res));
  }();
};

/**
 * Initialize object.
 */
Grid.prototype.init= function(){
  this.program.a_Position = getShaderVar(this.program, 'a_Position');
  this.program.u_Color = getShaderVar(this.program, 'u_Color');
  this.program.u_Translation = getShaderVar(this.program, 'u_Translation');
  this.vertexBuffer=createArrBuffer(this.points, gl.STATIC_DRAW);
};

/**
 * Draw object.
 */
Grid.prototype.draw= function(){
  setUniform(this.program.u_Translation, cameraTranslation, true);
  setUniform(this.program.u_Color, this.color, true);
  initAttribute(this.program.a_Position, this.vertexBuffer, 2, gl.FLOAT, 0, 0);
  gl.drawArrays(gl.LINES, 0, this.points.length/2);
};

//Ship data stored here.
var Ship = function(){
  this.loaded=false;
  this.vshader= "vship.glsl";
  this.fshader= "fship.glsl";
  this.blend= true;
  this.texCoords= new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  this.points= new Float32Array([-shipWidth, -shipHeight, shipWidth, -shipHeight, -shipWidth, shipHeight, shipWidth, shipWidth]);
  this.textures= [];
  this.modelMatrix= new Matrix4();
};

/**
 * Checks to see if object textures have loaded.
 */
Ship.prototype.checkObjLoaded= function(){
  if(this.textures.length>0){
    this.loaded=true;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[0].image);
  }
  else this.loaded=false;
};

/**
 * Initialize object.
 */
Ship.prototype.init= function(){
  this.program.a_Position = getShaderVar(this.program, 'a_Position');
  this.program.a_TexCoord = getShaderVar(this.program, 'a_TexCoord');   
  this.program.u_Model = getShaderVar(this.program, 'u_Model');
  this.program.u_Image=getShaderVar(this.program, 'u_Image');
  this.vertexBuffer=createArrBuffer(this.points, gl.STATIC_DRAW);
  this.textureBuffer=createArrBuffer(this.texCoords, gl.STATIC_DRAW);
  loadTexture("ship.gif", this);
};

/**
 * Draw object.
 */
Ship.prototype.draw= function(){
  if(player.fuel <= 0) return;
  gl.activeTexture(this.textures[0].unit);
  gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
  setUniform(this.program.u_Image, this.textures[0].unitIndex, false);
  gl.uniformMatrix4fv(this.program.u_Model, false, this.modelMatrix.elements);
  initAttribute(this.program.a_Position, this.vertexBuffer, 2, gl.FLOAT, 0, 0);
  initAttribute(this.program.a_TexCoord, this.textureBuffer, 2, gl.FLOAT, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

//Individual star data is stored here. It is randomly generated.
var Stars = function(){ 
  this.loaded= true;
  this.vshader= "vstar.glsl";
  this.fshader= "fstar.glsl";

/**
 * Generate points.
 */
  this.points= function(){
    var res=[];
    for(i=0; i<starCount*2; i++){
      res.push(Math.random()*galaxySize-galaxySize/2);
    }
    return new Float32Array(res);
  }();

/**
 * Generate colors.
 */
  this.colors= function(){
    var res = [];
    for(i=0; i<starCount; i++){
      res.push(Math.random()/starRedDivisor+starRedOffset);
      res.push(Math.random()/starGreenDivisor+starGreenOffset);
      res.push(Math.random()/starBlueDivisor+starBlueOffset);
    }
    return new Float32Array(res);
  }();

/**
 * Generate sizes.
 */
  this.sizes= function(){
    var res = [];
    for(i=0; i<starCount; i++){
      res.push(Math.random()*starSize+starSizeOffset);
    }
    return new Float32Array(res);
  }();
};

/**
 * Initialize object.
 */
Stars.prototype.init=function(){
  this.program.a_Position = getShaderVar(this.program, 'a_Position');
  this.program.a_Size = getShaderVar(this.program, 'a_Size');
  this.program.a_Color = getShaderVar(this.program, 'a_Color');
  this.program.u_Translation = getShaderVar(this.program, 'u_Translation');
  this.vertexBuffer=createArrBuffer(this.points, gl.STATIC_DRAW);
  this.colorBuffer=createArrBuffer(this.colors, gl.STATIC_DRAW);
  this.sizeBuffer=createArrBuffer(this.sizes, gl.STATIC_DRAW);
};

/**
 * Draw object.
 */
Stars.prototype.draw=function(){
  setUniform(this.program.u_Translation, cameraTranslation, true);
  initAttribute(this.program.a_Position, this.vertexBuffer, 2, gl.FLOAT, 0, 0);
  initAttribute(this.program.a_Color, this.colorBuffer, 3, gl.FLOAT, 0, 0);
  initAttribute(this.program.a_Size, this.sizeBuffer, 1, gl.FLOAT, 0, 0);
  gl.drawArrays(gl.POINTS, 0, starCount);
};


//Shooting star effect data is stored here.
var Shooter=function(){
  this.loaded=true;
  this.vshader="vshoot.glsl";
  this.fshader="fshoot.glsl";
  this.points=new Float32Array([0,1,0,1.2]);
  this.color=[1,1,1,1];
  this.modelMatrix= new Matrix4();
  this.speed=0;
  this.angle=0;
  this.size=0;
};

/**
 * Initialize object.
 */
Shooter.prototype.init= function(){
  this.program.a_Position = getShaderVar(this.program, 'a_Position');
  this.program.u_Color = getShaderVar(this.program, 'u_Color');
  this.program.u_Model = getShaderVar(this.program, 'u_Model');
  this.vertexBuffer=createArrBuffer(this.points, gl.DYNAMIC_DRAW);
};

/**
 * Draw object.
 */
Shooter.prototype.draw= function(){
  initAttribute(this.program.a_Position, this.vertexBuffer, 2, gl.FLOAT, 0, 0);
  setUniform(this.program.u_Color, this.color, true);
  gl.uniformMatrix4fv(this.program.u_Model, false, this.modelMatrix.elements);
  gl.drawArrays(gl.LINES, 0, 2);
};

Shooter.prototype.animate= function(){
  var shootRoll=Math.random()*1000;
  if(shootRoll>shootChance && this.speed<=0){
    this.color=shooterColor;
    this.speed=Math.random()/15+.09;
    this.size=Math.random()*3;
    var length=Math.random()*2+1;
    this.angle=Math.random()*30-15;
    this.modelMatrix.setTranslate(0, -1, 0);
    this.modelMatrix.rotate(this.angle, 0, 0, 1);
    this.modelMatrix.scale(1, length, 1);
    this.modelMatrix.translate(Math.random()*2-1, 1, 0);
  } else if(this.speed>0){
    if(this.modelMatrix.elements[13]+this.modelMatrix.elements[5]<=-1){
      this.color=[0,0,0,1];
      this.speed=0;
      this.size=0;
      this.angle=0;
      this.modelMatrix.setIdentity();
    } else{
      this.modelMatrix.translate(this.speed*Math.sin(this.angle*(Math.PI/180)), -this.speed*Math.cos(this.angle*(Math.PI/180)), 0);
    }
  }
};

//Planets data stored here.
var Planets=function(){
  this.loaded=false;
  this.vshader= "vplanet.glsl";
  this.fshader= "fplanet.glsl";
  this.blend= true;
  this.textures= [];

/**
 * Generate planet types.
 */
  this.types=function(){
    var res=[];
    for(i=0; i<planetCount; i++){
      res.push(Math.floor(Math.random()*planetTypes.length));
    }
    return res;
  }();

/**
 * Generate fuel.
 */
  this.fuel=function(){
    var res=[];
    for(i=0; i<planetCount; ++i){
      res.push(Math.round(Math.random()*5+10));
    }
    return res;
  }();

/**
 * Generate points.
 */
  this.points=function(){
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
  }();
};

/**
 * Checks to see if object textures have loaded.
 */
Planets.prototype.checkObjLoaded=function(){
  if(this.textures.length>planetTypes.length){
    this.textures=this.textures.filter(function(n){ return n!=undefined});
    this.textures.forEach(function(val){
      gl.bindTexture(gl.TEXTURE_2D, val);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, val.image);
    });
    this.loaded=true;
  }
  else this.loaded=false;
};

/**
 * Initialize object.
 */
Planets.prototype.init= function(){
  this.program.a_Position=getShaderVar(this.program, 'a_Position');
  this.program.a_TexCoord=getShaderVar(this.program, 'a_TexCoord');
  this.program.u_Translation=getShaderVar(this.program, 'u_Translation');
  this.program.u_Image=getShaderVar(this.program, 'u_Image');
  this.vertexBuffer=createArrBuffer(this.points, gl.STATIC_DRAW);
  for(i=0; i<planetTypes.length; ++i){
    loadTexture(planetTypes[i] + ".gif", this);
  }
  this.populated=[];
  for(i=0; i<planetCount; ++i){
    var planetType=this.types[i];
    if(typeInfo[planetType].populated)
      this.populated.push(Math.random()<typeInfo[planetType].populationChance);
    else this.populated.push(false);
  }
};

/**
 * Draw object.
 */
Planets.prototype.draw=function(){
  setUniform(this.program.u_Translation, cameraTranslation, true);
  initAttribute(this.program.a_Position, this.vertexBuffer, 2, gl.FLOAT, 16, 0);
  initAttribute(this.program.a_TexCoord, this.vertexBuffer, 2, gl.FLOAT, 16, 8);
  for(i=0; i<planetCount; ++i){
    var tex=this.textures[this.types[i]];
    gl.activeTexture(tex.unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
    gl.drawArrays(gl.TRIANGLE_FAN, i*(circleDegrees+2), circleDegrees+2);
  }
};
