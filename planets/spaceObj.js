//Grid data stored here.
var Grid = function(){
  this.loaded= true;
  this.vshader= "vgrid.glsl";
  this.fshader= "fgrid.glsl";

/**
 * Generates vertices for the grid.
 *
 * @return {Float32Array} Vertices to draw the grid.
 */
  this.shaderVars=new ShaderVars(
    ["a_Position", "u_Color", "u_Translation"],
    [
      function(){
        var res=[];
          for(i=-galaxySize/2-tileSize/2; i<=galaxySize/2+tileSize; i+=tileSize){
          res.push([i, -galaxySize/2-tileSize/2, i, galaxySize/2+tileSize/2, galaxySize/2+tileSize/2, i, -galaxySize/2-tileSize/2, i])
        }
        return new Float32Array([].concat.apply([], res));
      }(), [1, 1, 1, 1], cameraTranslation
    ], 
    [2, null, null]
  );
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars); 
};

/**
 * Draw object.
 */
Grid.prototype.draw= function(){
  this.shaderVars.u_Translation.data=cameraTranslation;
  setAllShaderVars(this);
  gl.drawArrays(gl.LINES, 0, this.shaderVars.a_Position.data.length/2);
};

//Ship data stored here.
var Ship = function(){
  this.textured=true;
  this.loaded=false;
  this.vshader= "vship.glsl";
  this.fshader= "fship.glsl";
  this.blend= true;
  this.shaderVars=new ShaderVars(
    ["a_Position", "a_TexCoords", "u_Model", "u_Image"],
    [new Float32Array([
      -shipWidth, -shipHeight, shipWidth, -shipHeight, 
      -shipWidth, shipHeight, shipWidth, shipWidth
    ]), new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), new Matrix4(), null], 
    [[false, false, false, true], [false, false, true, false]],
    [2, 2, null, null]
  );
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars); 
  this.texture="ship.gif";
  this.surfaceTexture="ship-surface";
  this.surfaceTextures=[
    "ship-right.gif",
    "ship-left.gif",
    "ship-top.gif",
    "ship-bottom.gif",
    "ship-back.gif",
    "ship-front.gif"
  ];
  loadTexture(this.texture, this);
//  loadCubeMap(this.surfaceTexture, this.surfaceTextures, this);
};

/**
 * Checks to see if object textures have loaded.
 */
Ship.prototype.checkObjLoaded= function(){
  this.loaded = 
    textures[this.texture]        && 
    textures[this.texture].loaded // && 
//    textures[this.surfaceTexture] && 
//    textures[this.surfaceTexture].loaded;
};

Ship.prototype.releaseTextureUnits = function(){
  texUnits[textures[this.texture].unit-gl.TEXTURE0]=false;
//  activateTexUnit(textures[this.surfaceTexture]);
};

Ship.prototype.gatherTextureUnits = function(){
//  texUnits[textures[this.surfaceTexture].unit-gl.TEXTURE0]=false;
  activateTexUnit(this.program, this.texture);
};

/**
 * Draw object.
 */
Ship.prototype.draw= function(){
  if(player.fuel <= 0) return;
  var tex=textures[this.texture];
  gl.activeTexture(tex.unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  setAllShaderVars(this);
  setUniform(this.program.u_Image, tex.unit-gl.TEXTURE0, false);
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

/**
 * Generate colors.
 */
  
/**
 * Generate sizes.
 */
  this.shaderVars=new ShaderVars(
    ["a_Position", "a_Color", "a_Size"],
    [function(){
      var res=[];
      for(i=0; i<starCount*2; i++){
        res.push(Math.random()*galaxySize-galaxySize/2);
      }
      return new Float32Array(res);
    }(), function(){
      var res = [];
      for(i=0; i<starCount; i++){
        res.push(Math.random()/starRedDivisor+starRedOffset);
        res.push(Math.random()/starGreenDivisor+starGreenOffset);
        res.push(Math.random()/starBlueDivisor+starBlueOffset);
      }
      return new Float32Array(res);
    }(), function(){
      var res = [];
      for(i=0; i<starCount; i++){
        res.push(Math.random()*starSize+starSizeOffset);
      }
      return new Float32Array(res);
    }()], [2, 3, 1]
  );
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);  
};

/**
 * Draw object.
 */
Stars.prototype.draw=function(){
  setAllShaderVars(this);
  gl.drawArrays(gl.POINTS, 0, starCount);
};


//Shooting star effect data is stored here.
var Shooter=function(){
  this.loaded=true;
  this.vshader="vshoot.glsl";
  this.fshader="fshoot.glsl";
  this.speed=0;
  this.angle=0;
  this.size=0;  
  this.shaderVars=new ShaderVars(
    ["a_Position", "u_Model", "u_Color"],
    [new Float32Array([0,1,0,1.2]), new Matrix4(), [1, 1, 1, 1]],
    [2, null, null] 
  );
  this.program=createShaderProgram(this.vshader, this.fshader, this.shaderVars);
}
/**
 * Draw object.
 */
Shooter.prototype.draw= function(){
  setAllShaderVars(this);
  gl.drawArrays(gl.LINES, 0, 2);
};

Shooter.prototype.animate= function(){
  var model=this.shaderVars.u_Model.data;
  var shootRoll=Math.random()*1000;
  if(shootRoll>shootChance && this.speed<=0){
    this.speed=Math.random()/15+.09;
    this.size=Math.random()*3;
    var length=Math.random()*2+1;
    this.angle=Math.random()*30-15;
    model.setTranslate(0, -1, 0);
    model.rotate(this.angle, 0, 0, 1);
    model.scale(1, length, 1);
    model.translate(Math.random()*2-1, 1, 0);
  } else if(this.speed>0){
    if(model.elements[13]+model.elements[5]<=-1){
      this.speed=0;
      this.size=0;
      this.angle=0;
      model.setIdentity();
    } else
      model.translate(this.speed*Math.sin(this.angle*(Math.PI/180)), 
        -this.speed*Math.cos(this.angle*(Math.PI/180)), 0); 
  }
};
