//Player state stored here.
var Player=function(){
  this.visited=[];
  this.money=30;
  this.fuel=100;
  this.planet=-1;
  this.centers=[]; 
  this.startPosition();
  this.perspective = (new Matrix4()).setPerspective(30, canvas.width/canvas.height, 1, 100);
};

Player.prototype.startPosition = function(){
  this.worldPos=new Vector3([0, 0, 0]);
  this.worldFacing=new Vector3([1, 0, 0]);
  this.worldTop=new Vector3([0, 1, 0]);
  this.currentFacingAngle = 0;
  this.view=new Matrix4();
};

Player.prototype.updateCamera = function(){
  if(currentlyPressedKeys[37]){
    this.rotate(false);
  }
  if(currentlyPressedKeys[38]){
    this.move(true);
  }
  if(currentlyPressedKeys[39]){
    this.rotate(true);
  }
  if(currentlyPressedKeys[40]){
    this.move(false);
  }
  this.view.setLookAt(
    this.worldPos.elements[0], this.worldPos.elements[1], this.worldPos.elements[2], 
    this.worldPos.elements[0] + this.worldFacing.elements[0], 
    this.worldPos.elements[1] + this.worldFacing.elements[1], 
    this.worldPos.elements[2] + this.worldFacing.elements[2], 
    this.worldTop.elements[0], this.worldTop.elements[1], this.worldTop.elements[2]
  );
  drawArraySurface.forEach(function(val){ 
    Generator.view().set(this.view); 
    Generator.proj().set(this.perspective); 
  }, this);
};

/**
 * Updates html elements on page to display information.
 */
Player.prototype.updateHud=function(){
  var planetType=this.planets.types[this.planet];
  document.getElementById("money-box").innerHTML = "Credits: " + this.money.toString();
  document.getElementById("gas-box").innerHTML = "Fuel: " + this.fuel.toString();
  document.getElementById("planets-box").innerHTML = "Planets left: " + (planetCount-this.visited.length).toString();
  document.getElementById("title-box").innerHTML = (this.planet>0 ? "You are on a " + planetTypes[planetType] + " planet" : "You are in open space.");
  document.getElementById("planet-image").src=(this.planet>0 ? textures[planetTypes[planetType]+".gif"].image.src : spaceImage);
  if(this.planet<0){
    document.getElementById("planet-pop").innerHTML = "";
    document.getElementById("planet-fuel").innerHTML = ""; 
    if(this.landButton){
      document.getElementById("planet-land").removeChild(this.landButton);
      this.landButton=null;
    }
    return;
  }
  document.getElementById("planet-pop").innerHTML = (this.planets.populated[this.planet])?"Populated":"Not Populated";
  document.getElementById("planet-fuel").innerHTML = "Fuel: " + this.planets.fuel[this.planet]; 
  if(this.landButton) return;
  this.landButton = document.createElement('input');
  this.landButton.type="button";
  this.landButton.value=(onPlanet ? "Leave" : "Land");
  this.landButton.onclick = function(){
    if(onPlanet){
      drawArraySurface.forEach(function(val){
        if(val.textured) val["releaseTextureUnits"]();
      });
      drawArraySpace.forEach(function(val){
        if(val.textured) val["gatherTextureUnits"]();
      });
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      player.startPosition();  
    } else {
      drawArraySpace.forEach(function(val){
        if(val.textured) val["releaseTextureUnits"]();
      });
      drawArraySurface.forEach(function(val){
        if(val.textured) val["gatherTextureUnits"]();
      });
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
    }
    onPlanet=!onPlanet;
  }
  document.getElementById("planet-land").appendChild(this.landButton);
}; 

/**
 * Compare ship location with planet locations, and take appropriate actions if
 * we are on a planet.
 */
Player.prototype.checkPlanet=function(){
  for(i=0; i<planetCount*2; i+=2){
    if(cameraTranslation[0].toFixed(2)==-this.centers[i].toFixed(2) && cameraTranslation[1].toFixed(2)==-this.centers[i+1].toFixed(2)){
      this.planet=i/2;
      this.fuel+=this.planets.fuel[this.planet];
      if(this.visited.indexOf(this.planet) < 0) this.visited.push(this.planet);
      return;
    }
  }
  this.planet=-1;
};

Player.prototype.rotate=function(pos){
  if(pos){
    this.currentFacingAngle+=rotationSpeed*Math.PI/180*deltaTime;
  } else {
    this.currentFacingAngle-=rotationSpeed*Math.PI/180*deltaTime;
  }
  this.worldFacing.elements[0] = Math.cos(this.currentFacingAngle);
  this.worldFacing.elements[2] = Math.sin(this.currentFacingAngle);
  this.worldFacing.normalize();
};

Player.prototype.move=function(pos){
  if(pos){
    this.worldPos.elements[0]+=moveSpeed*this.worldFacing.elements[0]*deltaTime;
    this.worldPos.elements[2]+=moveSpeed*this.worldFacing.elements[2]*deltaTime;
  } else {
    this.worldPos.elements[0]-=moveSpeed*this.worldFacing.elements[0]*deltaTime;
    this.worldPos.elements[2]-=moveSpeed*this.worldFacing.elements[2]*deltaTime;
  }
  if(this.worldPos.elements[0]>surfaceSize/2) 
    this.worldPos.elements[0]=surfaceSize/2;
  else if(this.worldPos.elements[0]<-surfaceSize/2)
    this.worldPos.elements[0]=-surfaceSize/2;
  if(this.worldPos.elements[2]>surfaceSize/2) 
    this.worldPos.elements[2]=surfaceSize/2;
  else if(this.worldPos.elements[2]<-surfaceSize/2) 
    this.worldPos.elements[2]=-surfaceSize/2;
};

Player.prototype.getPTypeIndex = function(){
  if(this.planet<0) return -1;
  else return this.planets.types[this.planet];
};
